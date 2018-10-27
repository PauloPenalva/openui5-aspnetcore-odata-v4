using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PessoasAPI.Models{

    [Table("pessoa")]
    public class Pessoa : BaseModel{
        
        [Required, MaxLength(100), MinLength(1)]
        public string nome { get; set; }
        
        [MaxLength(14)]
        public string cnpj { get; set; }
        
        [MaxLength(50)]
        public string inscricao { get; set; }

        [MaxLength(50)]
        public string telefone { get; set; }

    }
}