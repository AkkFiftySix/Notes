namespace Logic.Models;
public class NoteDto
{
    public int Id { get; set; }
    public string Header { get; set; }
    public string Description { get; set; }
    public string CreatedDate { get; set; }
    public string UpdatedDate { get; set; }
    public int UserId { get; set; }
}
