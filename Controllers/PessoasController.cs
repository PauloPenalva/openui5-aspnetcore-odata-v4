using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PessoasAPI.Contexto;
using PessoasAPI.Models;
using PessoasAPI.Filters;

namespace PessoasAPI.Controllers{
    public class PessoasController : BaseController<Pessoa>{

        private readonly PessoaDbContext _db ;

        public PessoasController(PessoaDbContext db) => this._db = db;

        [HttpGet]
        [EnableQuery]
        public IQueryable<Pessoa> Get() => _db.Pessoas;
        
        
        [ HttpGet, EnableQuery]
        public SingleResult<Pessoa> Get([FromODataUri] int key) => 
            SingleResult.Create(_db.Pessoas.Where(x => x.id == key));   
        

         // POST: odata/Pessoas
        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> Post([FromBody] Pessoa pessoa)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            _db.Pessoas.Add(pessoa);
            await _db.SaveChangesAsync();

            return Created(pessoa);     
        }


        // PUT: odata/Pessoas(5)
        [HttpPut]
        public async Task<IActionResult> Put([FromODataUri] int key, [FromBody] Delta<Pessoa> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Pessoa pessoa = _db.Pessoas.Find(key);
            if (pessoa == null)
            {
                return NotFound();
            }

            patch.Put(pessoa);

            try
            {
                await  _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PessoaExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(pessoa);
        }

       
        // PATCH: odata/Pessoas(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IActionResult> Patch([FromODataUri] int key,[FromBody] Delta<Pessoa> patch)
        {
            if (patch == null)
            {
                throw new ArgumentNullException(nameof(patch));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Pessoa pessoa = _db.Pessoas.Find(key);
            if (pessoa == null)
            {
                return NotFound();
            }

            patch.Patch(pessoa);

            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PessoaExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(pessoa);
        }

        // DELETE: odata/Pessoas(5)
        [HttpDelete]
        public async Task<IActionResult> Delete([FromODataUri] int key)
        {
            Pessoa pessoa = _db.Pessoas.Find(key);
            if (pessoa == null)
            {
                return NotFound();
            }

            _db.Pessoas.Remove(pessoa);
            
            await _db.SaveChangesAsync();

            return NoContent();
        }

        private bool PessoaExists(int key)
        {
            return _db.Pessoas.Count(e => e.id == key) > 0;
        }
    }

}