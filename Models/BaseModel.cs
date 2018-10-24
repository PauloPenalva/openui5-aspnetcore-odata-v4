using System;
using System.ComponentModel.DataAnnotations;

namespace PessoasAPI.Models{

    public class BaseModel
    {
        public BaseModel()
        {}

        [Key]
        public int id { get; set; }

    }
}