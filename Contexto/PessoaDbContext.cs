using Microsoft.EntityFrameworkCore;
using PessoasAPI.Models;

namespace PessoasAPI.Contexto{

    public class PessoaDbContext : DbContext{
       
        public PessoaDbContext(DbContextOptions<PessoaDbContext> options) : base(options)
        { }

        public DbSet<Pessoa> Pessoas { get; set; }
    }

}