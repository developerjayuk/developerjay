using System.ComponentModel.DataAnnotations;

namespace DeveloperJayLibrary.Models;

public class Tag : BaseEntity
{
    [Required]
    public string Title { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public string Slug { get; set; }
    public List<PostTags> PostTags { get; set; } = new();
}
