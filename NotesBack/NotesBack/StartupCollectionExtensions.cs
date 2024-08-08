using Data;
using FluentValidation;
using Logic.Impl;
using Logic.Interfaces;
using Logic.Models;
using Logic.Validation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Debug;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace NotesBack;

public static class StartupCollectionExtensions
{
    public static IServiceCollection AddAuth(this IServiceCollection sc, AppSettings appsettings)
    {
        sc.AddAuthorization()
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = appsettings.JwtSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = appsettings.JwtSettings.Audience,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appsettings.JwtSettings.Key)),
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero
                };
            });
        return sc;
    }

    public static IServiceCollection AddDb(this IServiceCollection sc, IConfiguration configuration)
    {
        var filterOptions = new LoggerFilterOptions { MinLevel = LogLevel.Information };
        var myLoggerFactory = new LoggerFactory(new[] { new DebugLoggerProvider() }, filterOptions);
        
        sc.AddDbContext<NotesDbContext>(options =>
        {
            options.UseLazyLoadingProxies();
            options.EnableSensitiveDataLogging();
            options.UseLoggerFactory(myLoggerFactory);
            options.UseNpgsql(configuration.GetConnectionString("NotesDatabase"));
        });

        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

        return sc;
    }

    public static IServiceCollection AddServices(this IServiceCollection sc)
    {
        return sc.AddTransient<IAuthUsersService, AuthUsersService>()
            .AddTransient<INotesService, NotesService>()
            .AddScoped<IValidator<RegisterDto>, RegisterDtoValidator>()
            ;
    }

    public static IServiceCollection AddSwagger(this IServiceCollection sc)
    {
        return sc.AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = @"JWT Token",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement()
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header,
                    },
                    new List<string>()
                }
            });
        });
    }

    public static void ApplyMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;

        var context = services.GetRequiredService<NotesDbContext>();
        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }
    }
}
