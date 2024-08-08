using Data;
using Logic.MapperProfiles;
using Logic.Models;
using NotesBack;
using NotesBack.Filters;

var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

var config = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{env}.json", optional: true)
        .AddEnvironmentVariables()
        .Build();

var appsettings = config.GetSection("AppSettings").Get<AppSettings>();

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddSingleton(appsettings)
    .AddDb(config)
    .AddAuth(appsettings)
    .AddAutoMapper(typeof(NoteProfile).Assembly)
    .AddServices()
    .AddSwagger()
    ;
;

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ExceptionFilter>();
});
builder.Services.AddEndpointsApiExplorer();

builder.Logging.AddConsole();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithExposedHeaders("*"));
app.UseAuthorization();
app.MapControllers();
app.ApplyMigrations();
app.Run();