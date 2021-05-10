
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class GuestController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;
         private readonly DataContext _context;
        public GuestController(IUnitOfWork unitOfWork, IMapper mapper,

        IPhotoService photoService, UserManager<AppUser> userManager, DataContext context)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _photoService = photoService;
            _mapper = mapper;
            _context = context;
        }
         
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
    {
        var gender = await _unitOfWork.UserRepository.GetUserGender(User.GetUsername());
        userParams.CurrentUsername = User.GetUsername();

        if (string.IsNullOrEmpty(userParams.Gender))
            userParams.Gender = gender == "male" ? "female" : "male";

        var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);

        Response.AddPaginationHeader(
            users.CurrentPage, users.PageSize,
            users.TotalCount, users.TotalPages);

        return Ok(users);
    }
    //     [HttpGet]
    //     public async Task<IEnumerable<MemberUpdateDto>> GetUsers()
    //     {
    //         // var gender = await _unitOfWork.UserRepository.GetUserGender(User.GetUsername());
    //         // userParams.CurrentUsername = User.GetUsername();

    //         // if (string.IsNullOrEmpty(userParams.Gender))
    //         //     userParams.Gender = gender == "male" ? "female" : "male";

    //         // var users = await _unitOfWork.UserRepository.GetUsersAsync();
    //           var users = await _context.Users.Where(g=>g.Gender == "female").ToListAsync();     
    //           var usersToReturn = _mapper.Map<IEnumerable<MemberUpdateDto>>(users);
    //         // Response.AddPaginationHeader(
    //         //     users.CurrentPage, users.PageSize,
    //         //     users.TotalCount, users.TotalPages);

    //         return usersToReturn;
    //     }
    //     //      [HttpGet]
    //     // public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    //     // {
    //     //     return await _context.Users.ToListAsync();
    //     // }
    // }
    }  
}