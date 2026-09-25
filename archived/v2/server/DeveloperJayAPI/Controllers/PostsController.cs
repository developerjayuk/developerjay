using DeveloperJayLibrary.DataAccess;
using DeveloperJayLibrary.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DeveloperJayAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PostsController : ControllerBase
{
    private readonly ILogger<PostsController> _logger;
    private readonly BlogContext _blog;

    public PostsController(ILogger<PostsController> logger, BlogContext blog)
    {
        _logger = logger;
        _blog = blog;
    }

    // GET: api/posts
    [HttpGet]
    public async Task<ActionResult<List<Post>>> GetPosts([FromQuery] bool active = true)
    {
        var posts = await _blog.Posts.Where(p => p.Active == active).ToListAsync();
        return Ok(posts);
    }

    // GET api/posts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Post>> GetPostById(int id)
    {
        var post = await _blog.Posts.FindAsync(id);

        if (post == null)
        {
            return NotFound($"Post with Id: {id} not found!");
        }

        return Ok(post);
    }

    // POST api/posts
    [HttpPost]
    public async Task<ActionResult<Post>> CreatePost([FromBody] Post newPost)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        // update dates
        newPost.CreatedDate = DateTime.Now;
        if (newPost.Active)
        {
            newPost.ActiveDate = DateTime.Now;
        }

        _blog.Posts.Add(newPost);
        await _blog.SaveChangesAsync();
        
        return NoContent();
    }

    // PUT api/posts/5
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdatePost(int id, [FromBody] Post updatePost)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var post = await _blog.Posts.FindAsync(id);
        if (post == null)
        {
            return NotFound();
        }

        // content
        post.Title = updatePost.Title;
        post.Content = updatePost.Content;
        post.Slug = updatePost.Slug;
        post.Summary = updatePost.Summary;

        // linked data
        if (updatePost.PostCategories.Any())
        {
            post.PostCategories = updatePost.PostCategories;
        }
        if (updatePost.PostTags.Any())
        {
            post.PostTags = updatePost.PostTags;
        }

        // dates 
        post.UpdatedDate = DateTime.Now;
        if (post.Active == false && updatePost.Active)
        {
            post.ActiveDate = DateTime.Now;
        }
        post.Active = updatePost.Active;

        _blog.Posts.Update(post);
        await _blog.SaveChangesAsync();

        return NoContent();
    }

    // DELETE api/posts/5
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePost(int id, bool hardDelete = false)
    {
        var post = await _blog.Posts.FindAsync(id);

        if (post == null)
        {
            return NotFound();
        }

        if (hardDelete)
        {
            _blog.Posts.Remove(post);
        }
        else
        {
            post.Active = false;
        }

        await _blog.SaveChangesAsync();

        return NoContent();
    }
}
