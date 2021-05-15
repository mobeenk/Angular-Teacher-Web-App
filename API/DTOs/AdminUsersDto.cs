using System.Collections.Generic;
using API.Entities;

namespace API.DTOs
{
    public class AdminUsersDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public List<AppRole> Roles { get; set; }
    }
}