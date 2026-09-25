using System.ComponentModel.DataAnnotations;

namespace DeveloperJayLibrary.Models;

public class Comment : BaseEntity
{
    [Required]
    public string Content { get; set; }
    [Required]
    public string PostedBy { get; set; }
    [Required]
    public Comment ParentComment { get; set; }
    [Required]
    public Post ParentPost { get; set; }
}
