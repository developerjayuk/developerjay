using System.ComponentModel.DataAnnotations;

namespace DeveloperJayLibrary.Models;

public class Post : BaseEntity
{
    [Required]
    public string Title { get; set; }
    [Required]
    public string Slug { get; set; }
    [Required]
    public string Summary { get; set; }
    [Required]
    public string Content { get; set; }
    public List<PostTags> PostTags { get; set; } = new();
    public List<PostCategories> PostCategories { get; set; } = new();
    public List<Comment> Comments { get; set; } = new();
}
