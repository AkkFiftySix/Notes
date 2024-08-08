using Microsoft.EntityFrameworkCore;

namespace Data.Infrastructure;

public class NotesServiceDbContextFactory : DesignTimeDbContextFactoryBase<NotesDbContext>
{
    protected override NotesDbContext CreateNewInstance(DbContextOptions<NotesDbContext> options)
    {
        return new NotesDbContext(options);
    }
}