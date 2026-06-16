namespace ITransitionTask4.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public void DeleteRange(List<User> users)
        {
            _context.Users.RemoveRange(users);
        }

        public IQueryable<User> GetAll(params Expression<Func<User, object>>[] includes)
        {
            IQueryable<User> query = _context.Users;
            foreach (var include in includes) { 
                query = query.Include(include);
            }
            return query;
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
        }

        public void UpdateRange(List<User> users)
        {
            _context.Users.UpdateRange(users);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
