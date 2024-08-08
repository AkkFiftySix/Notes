using AutoMapper;
using Data;
using Data.Entities;
using FluentValidation;
using Logic.Exceptions;
using Logic.Extensions;
using Logic.Interfaces;
using Logic.Models;
using Microsoft.EntityFrameworkCore;

namespace Logic.Impl;
public class NotesService(
    NotesDbContext ctx,
    IMapper mapper) : INotesService
{
    public async Task<NoteDto[]> GetNotes(GetNotesDto dto, int userId, CancellationToken ct)
    {
        var result = await ctx.Notes
            .AsNoTracking()
            .Where(x => x.UserId == userId && x.IsDeleted == dto.IsDeleted)
            .IfWhere(!string.IsNullOrEmpty(dto.SearchString),
                x => x.Header.Contains(dto.SearchString) || x.Description.Contains(dto.SearchString))
            .OrderByDescending(x => x.UpdatedDate)
            .Select(x => mapper.Map<NoteDto>(x))
            .ToArrayAsync(ct);
        return result;
    }

    public async Task<NoteDto> CreateNote(NoteDto dto, CancellationToken ct)
    {
        if (ctx.Notes.Any(x => x.Header == dto.Header))
            throw new AlreadyExistsException("Note with this header already exists");
        
        var note = mapper.Map<Note>(dto);
        await ctx.Notes.AddAsync(note, ct);
        await ctx.SaveChangesAsync(ct);
        return mapper.Map<NoteDto>(note);
    }

    public async Task<NoteDto> UpdateNote(NoteDto dto, CancellationToken ct)
    {
        if (ctx.Notes.Any(x => x.Header == dto.Header && x.Id != dto.Id))
            throw new AlreadyExistsException("Note with this header already exists");

        var note = await ctx.Notes
            .AsTracking()
            .FirstOrDefaultAsync(x => x.Id == dto.Id, ct);
        mapper.Map(dto, note);
        await ctx.SaveChangesAsync(ct);
        return dto;
    }

    public async Task SoftDeleteNote(int noteId, CancellationToken ct)
    {
        await ctx.Notes
            .Where(x => x.Id == noteId)
            .ExecuteUpdateAsync(x => x
                .SetProperty(x => x.IsDeleted, true)
                .SetProperty(x => x.UpdatedDate, DateTime.Now), ct);
    }

    public async Task RestoreNote(int noteId, CancellationToken ct)
    {
        var noteToRestoreHeader = await ctx.Notes
            .AsNoTracking()
            .Where(x => x.Id == noteId)
            .Select(x => x.Header)
            .FirstAsync(ct);

        if (await ctx.Notes.AnyAsync(x => !x.IsDeleted && x.Header == noteToRestoreHeader, ct))
            throw new AlreadyExistsException("Note with this header already exists");

        await ctx.Notes
            .Where(x => x.Id == noteId)
            .ExecuteUpdateAsync(x => x
                .SetProperty(x => x.IsDeleted, false)
                .SetProperty(x => x.UpdatedDate, DateTime.Now), ct);
    }

    public async Task DeleteNote(int noteId, CancellationToken ct)
    {
        await ctx.Notes
            .Where(x => x.Id == noteId)
            .ExecuteDeleteAsync(ct);
    }

    public async Task DeleteAllNotes(int userId, CancellationToken ct)
    {
        await ctx.Notes
            .Where(x => x.UserId == userId && x.IsDeleted)
            .ExecuteDeleteAsync(ct);
    }
}
