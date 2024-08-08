using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities;

[Table("Notes")]
public class Note
{
    [Key]
    public int Id { get; set; }
    public string Header { get; set; }
    public string Description { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public bool IsDeleted { get; set; }

    public int UserId { get; set; }
    public virtual User User { get; set; }
}
