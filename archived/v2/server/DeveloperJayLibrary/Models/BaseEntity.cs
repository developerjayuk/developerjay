namespace DeveloperJayLibrary.Models;

public class BaseEntity
{
    public int Id { get; set; }
    public bool Active { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; } = DateTime.Now;
    public DateTime? ActiveDate { get; set; } = null;
}
