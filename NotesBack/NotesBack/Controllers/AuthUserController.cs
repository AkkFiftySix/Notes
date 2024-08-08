using Logic.Interfaces;
using Logic.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace NotesBack.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthUserController(IAuthUsersService service) : BaseController
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthDto dto, CancellationToken ct)
    {
        HttpContext.Response.Headers.Authorization = await service.Login(dto, ct);
        return Ok();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken ct)
    {
        await service.Register(dto, ct);
        return Ok();
    }

    [HttpPost("confirm/{login}/{confirmationCode}")]
    public async Task<IActionResult> ConfirmRegister(string login, string confirmationCode, CancellationToken ct)
    {
        HttpContext.Response.Headers.Authorization = await service.ConfirmRegister(login, confirmationCode, ct);
        return Ok();
    }

    [HttpPost("reset-confirm/{login}")]
    public async Task<IActionResult> ConfirmRegister(string login, CancellationToken ct)
    {
        await service.ResetConfirmationCode(login, ct);
        return Ok();
    }

    [Authorize]
    [HttpGet("self")]
    public async Task<IActionResult> Self(CancellationToken ct) =>
        Ok(await service.GetUser(UserId, ct));
}
