namespace Logic.Models;
public class GetNotesDto
{
    public string SearchString { get; set; }
    public bool IsDeleted { get; set; } = false;
}
