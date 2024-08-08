using Data.Entities;
using Logic.Models;

namespace Logic.Interfaces;
public interface INotesService
{
    public Task<NoteDto[]> GetNotes(GetNotesDto dto, int userId, CancellationToken ct);
    public Task<NoteDto> CreateNote(NoteDto dto, CancellationToken ct);
    public Task<NoteDto> UpdateNote(NoteDto dto, CancellationToken ct);
    public Task SoftDeleteNote(int noteId, CancellationToken ct);
    public Task RestoreNote(int noteId, CancellationToken ct);
    public Task DeleteNote(int noteId, CancellationToken ct);
    public Task DeleteAllNotes(int userId, CancellationToken ct);
}
