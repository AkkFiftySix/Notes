using AutoMapper;
using Data.Entities;
using Logic.Models;

namespace Logic.MapperProfiles;
public class NoteProfile : Profile
{
    public NoteProfile()
    {
        CreateMap<Note, NoteDto>()
            .ForMember(x => x.CreatedDate, o => o.MapFrom(x => x.CreatedDate.ToString("dd.MM.yyyy HH:mm")))
            .ForMember(x => x.UpdatedDate, o => o.MapFrom(x => x.UpdatedDate.ToString("dd.MM.yyyy HH:mm")))
            .ReverseMap()
            .ForMember(note => note.CreatedDate, o => o.MapFrom((noteDto, note) => note?.CreatedDate == DateTime.MinValue ? DateTime.Now : note.CreatedDate))
            .ForMember(note => note.UpdatedDate, o => o.MapFrom(noteDto => DateTime.Now))
            ;
    }
}
