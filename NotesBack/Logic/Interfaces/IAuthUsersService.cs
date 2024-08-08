using Logic.Models;

namespace Logic.Interfaces;
public interface IAuthUsersService
{
    public Task<string> Login(AuthDto dto, CancellationToken ct);
    public Task Register(RegisterDto dto, CancellationToken ct);
    public Task<string> ConfirmRegister(string login, string confirmationCode, CancellationToken ct);
    public Task ResetConfirmationCode(string login, CancellationToken ct);
    public Task<UserDto> GetUser(int userId, CancellationToken ct);
}
