using Data;
using FluentValidation;
using Logic.Models;
using Microsoft.EntityFrameworkCore;

namespace Logic.Validation;
public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    private readonly NotesDbContext _ctx;

    public RegisterDtoValidator(NotesDbContext ctx)
    {
        _ctx = ctx;

        RuleLevelCascadeMode = CascadeMode.Stop;

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Incorrect email")
            .MustAsync(EmailUnique).WithMessage("User with this email already exists");

        RuleFor(x => x.Login)
            .MustAsync(LoginUnique).WithMessage("User with this login already exists");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Your password cannot be empty")
            .Equal(x => x.ConfirmPassword).WithMessage("Passwords are different")
            .MinimumLength(8).WithMessage("Your password length must be at least 8")
            .MaximumLength(16).WithMessage("Your password length must not exceed 16")
            .Matches(@"[A-Z]+").WithMessage("Your password must contain at least one uppercase letter")
            .Matches(@"[a-z]+").WithMessage("Your password must contain at least one lowercase letter")
            .Matches(@"[0-9]+").WithMessage("Your password must contain at least one number")
            .Matches(@"[\!\?\*\.]+").WithMessage("Your password must contain at least one (!? *.)");
    }

    private async Task<bool> EmailUnique(string email, CancellationToken ct) =>
        !await _ctx.Users.AnyAsync(x => x.Email == email);

    private async Task<bool> LoginUnique(string login, CancellationToken ct) =>
        !await _ctx.Users.AnyAsync(x => x.Login == login);
}
