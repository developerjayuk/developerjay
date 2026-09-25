using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
namespace DeveloperJayLibrary.DataAccess;

public class BlogContextFactory : IDesignTimeDbContextFactory<BlogContext>
{
    public BlogContextFactory()
    {
    }
    private IConfiguration Configuration => new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json")
        .Build();
    public BlogContext CreateDbContext(string[] args)
    {

        var builder = new DbContextOptionsBuilder<BlogContext>();
        builder.UseSqlServer(Configuration.GetConnectionString("Default"));
        return new BlogContext(builder.Options);
    }
}
