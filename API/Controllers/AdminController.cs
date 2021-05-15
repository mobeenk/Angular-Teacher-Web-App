using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;
        public AdminController(UserManager<AppUser> userManager
        , IUnitOfWork unitOfWork, IPhotoService photoService
        , IMapper mapper
        )
        {
            _photoService = photoService;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
        }
    //     [Authorize(Policy = "RequireAdminRole")]
    //     [HttpGet("users-with-roles")]
    //   public async Task<ActionResult> GetUsersWithRoles()
    //     {
    //         var users = await _userManager.Users
    //             .Include(r => r.UserRoles)
    //             .ThenInclude(r => r.Role)
    //             .OrderBy(u => u.UserName)
    //             .Select(u => new
    //             {
    //                 u.Id,
    //                 Username = u.UserName,
    //                 Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
    //             })
    //             .ToListAsync();


    //         return Ok(users);
    //     }


        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult<IEnumerable<AdminUsersDto>>> GetUsersWithRoles([FromQuery] UserParams userParams)
        {
            userParams.CurrentUsername = User.GetUsername();
           var users = await GetAdminUsers(userParams);
           
              Response.AddPaginationHeader(users.CurrentPage, users.PageSize,
                users.TotalCount, users.TotalPages);
            return Ok(users);
        }
        public async Task<PagedList<AdminUsersDto>> GetAdminUsers(UserParams likesParams)
        {
               var query =  _userManager.Users.AsQueryable()
                .Include(r => r.UserRoles)
                // .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .ProjectTo<AdminUsersDto>(_mapper.ConfigurationProvider).AsNoTracking()
               ;
           
            return await PagedList<AdminUsersDto>.CreateAsync(
                 query,
                likesParams.PageNumber, likesParams.PageSize);
        }


        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find user");

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }



        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public async Task<ActionResult> GetPhotosForModeration()
        {
            var photos = await _unitOfWork.PhotoRepository.GetUnapprovedPhotos();
            return Ok(photos);
        }
        // [Authorize(Policy = "ModeratePhotoRole")]
        // [HttpPost("approve-photo/{photoId}")]
        // public async Task<ActionResult> GetPhotosForApproval(int photoId)
        // {
        //     var photo = await _unitOfWork.PhotoRepository.GetPhotoById(photoId);
        //     photo.IsApproved = true;
        //     await _unitOfWork.Complete();
        //     return Ok();
        // }
        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("reject-photo/{photoId}")]
        public async Task<IActionResult> RejectPhoto(int photoId)
        {
            var photo = await _unitOfWork.PhotoRepository.GetPhotoById(photoId);
            // this photo on cloudinary
            if (photo.PublicId != null)
            {
                // delete from cloudinary
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Result == "ok")
                {
                    // delete from our database
                    _unitOfWork.PhotoRepository.RemovePhoto(photo);
                }
            }
            else
            {
                _unitOfWork.PhotoRepository.RemovePhoto(photo);
            }
            await _unitOfWork.Complete();
            return Ok();
        }
        [HttpPost("approve-photo/{photoId}")]
        public async Task<ActionResult> ApprovePhoto(int photoId)
        {
            var photo = await _unitOfWork.PhotoRepository.GetPhotoById(photoId);
            if (photo == null)
                return NotFound("Could not find photo");
            photo.IsApproved = true;
            var user = await _unitOfWork.UserRepository.GetUserByPhotoId(photoId);

            if (!user.Photos.Any(x => x.IsMain))
                photo.IsMain = true;

            await _unitOfWork.Complete();
            return Ok();
        }
    }
}