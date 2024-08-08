using AutoMapper;
using Data.Entities;
using Logic.Models;

namespace Logic.MapperProfiles;
public class UserProfile : Profile
{
	public UserProfile()
	{
		CreateMap<RegisterDto, User>()
			.ForMember(user => user.EmailConfirmed, o => o.MapFrom(registerDto => false))
			.ForMember(user => user.CreatedDate, o => o.MapFrom(registerDto => DateTime.Now))
			.ForMember(user => user.UpdatedDate, o => o.MapFrom(registerDto => DateTime.Now))
			;

		CreateMap<User, UserDto>()
			;
    }
}
