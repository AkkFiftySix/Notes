using AutoMapper;
using Data;
using Data.Entities;
using FluentValidation;
using Logic.Exceptions;
using Logic.Extensions;
using Logic.Interfaces;
using Logic.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Logic.Impl;
public class AuthUsersService(
    NotesDbContext ctx,
    IMapper mapper,
    AppSettings appsettings,
    IValidator<RegisterDto> registerDtoValidator) : IAuthUsersService
{
    public async Task<string> Login(AuthDto dto, CancellationToken ct)
    {
        var user = (await ctx.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Login == dto.Login || x.Email == dto.Login))
            .ThrowIfNull(() => new AuthException());

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.EncryptedPassword))
            throw new AuthException();

        if (!user.EmailConfirmed)
            throw new EmailNotConfirmedException();

        var token = GenerateJwt(user.Id);
        return token;
    }

    public async Task Register(RegisterDto dto, CancellationToken ct)
    {
        await registerDtoValidator.ValidateAndThrowAsync(dto, ct);
        var user = mapper.Map<User>(dto);
        user.EncryptedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        await GenerateConfirmationCode(user, ct);
        await ctx.AddAsync(user, ct);
        await ctx.SaveChangesAsync(ct);
    }

    public async Task<string> ConfirmRegister(string login, string confirmationCode, CancellationToken ct)
    {
        var user = await ctx.Users
            .AsTracking()
            .FirstOrDefaultAsync(x => x.Login == login || x.Email == login);

        if (!BCrypt.Net.BCrypt.Verify(confirmationCode, user.EncryptedConfirmationCode))
            throw new EmailConfirmationException();

        user.EmailConfirmed = true;
        user.EncryptedConfirmationCode = null;
        await ctx.SaveChangesAsync(ct);

        var token = GenerateJwt(user.Id);
        return token;
    }

    public async Task ResetConfirmationCode(string login, CancellationToken ct)
    {
        var user = await ctx.Users
            .AsTracking()
            .FirstOrDefaultAsync(x => x.Login == login || x.Email == login, ct);
        await GenerateConfirmationCode(user, ct);
        await ctx.SaveChangesAsync(ct);
    }

    public async Task<UserDto> GetUser(int userId, CancellationToken ct)
    {
        var user = await ctx.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == userId, ct);

        return mapper.Map<UserDto>(user);
    }

    #region Private Methods

    private string GenerateJwt(int userId)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appsettings.JwtSettings.Key));

        var jwtClaims = new List<Claim>
        {
            new(CustomClaims.UserId, userId.ToString())
        };

        var token = new JwtSecurityToken(
            appsettings.JwtSettings.Issuer,
            appsettings.JwtSettings.Audience,
            jwtClaims,
            DateTime.Now,
            DateTime.Now.AddMinutes(appsettings.JwtSettings.MinutesToExpiration),
            new SigningCredentials(key, SecurityAlgorithms.HmacSha512)
        );

        return "Bearer " + new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task GenerateConfirmationCode(User user, CancellationToken ct)
    {
        string confirmationCode;
        if (!appsettings.ConstantConfirmationCode)
        {
            var rnd = new Random();
            var confirmationCodeBuilder = new StringBuilder();
            for (var i = 0; i < 6; i++)
                confirmationCodeBuilder.Append(rnd.Next(1, 10));
            confirmationCode = confirmationCodeBuilder.ToString();
        }
        else
            confirmationCode = "111111";

        Console.WriteLine(confirmationCode); // TODO SMTP

        user.EncryptedConfirmationCode = BCrypt.Net.BCrypt.HashPassword(confirmationCode.ToString());
        await Task.CompletedTask;
    }

    #endregion
}
