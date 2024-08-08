using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities;

[Table("Users")]
public class User
{
    [Key]
    public int Id { get; set; }
    public string Email { get; set; }
    public string Login { get; set; }
    public string EncryptedPassword { get; set; }
    public bool EmailConfirmed { get; set; }
    public string EncryptedConfirmationCode { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }

    public virtual ICollection<Note> Notes { get; set;}
}
