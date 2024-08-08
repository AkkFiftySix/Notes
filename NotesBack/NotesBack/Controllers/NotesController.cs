using Logic.Interfaces;
using Logic.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace NotesBack.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class NotesController(INotesService notesService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetNotes([FromQuery] GetNotesDto dto, CancellationToken ct) =>
        Ok(await notesService.GetNotes(dto, UserId, ct));

    [HttpPost]
    public async Task<IActionResult> CreateNote([FromBody] NoteDto dto, CancellationToken ct)
    {
        dto.UserId = UserId;
        return Ok(await notesService.CreateNote(dto, ct));
    }

    [HttpPut]
    public async Task<IActionResult> UpdateNote([FromBody] NoteDto dto, CancellationToken ct)
    {
        dto.UserId = UserId;
        return Ok(await notesService.UpdateNote(dto, ct));
    }
        

    [HttpDelete("soft/{noteId}")]
    public async Task<IActionResult> SoftDeleteNote(int noteId, CancellationToken ct)
    {
        await notesService.SoftDeleteNote(noteId, ct);
        return Ok();
    }

    [HttpPost("restore/{noteId}")]
    public async Task<IActionResult> RestoreNote(int noteId, CancellationToken ct)
    {
        await notesService.RestoreNote(noteId, ct);
        return Ok();
    }

    [HttpDelete("{noteId}")]
    public async Task<IActionResult> DeleteNote(int noteId, CancellationToken ct)
    {
        await notesService.DeleteNote(noteId, ct);
        return Ok();
    }

    [HttpDelete("all")]
    public async Task<IActionResult> DeleteAllNotes(CancellationToken ct)
    {
        await notesService.DeleteAllNotes(UserId, ct);
        return Ok();
    }
}
