using AngularAuthApi.Models.DTOs;

namespace AngularAuthApi.Services.Interfaces
{
    public interface IUserService
    {
        Task<bool> RegisterUserAsync(RegisterUserDto registerUserDto);
        Task<bool> RegisterDoctorAsync(RegisterDoctorDto registerDoctorDto);
        Task<List<UserResponseDto>> GetAllDoctorsAsync();
        Task<UserResponseDto?> GetDoctorByIdAsync(int id);
        Task<UserResponseDto?> GetDoctorByIdNumberAsync(string idNumber);
        Task<UserResponseDto?> GetUserByIdAsync(int id);
        Task<UserResponseDto?> GetClientByIdNumberAsync(string idNumber);
        Task<UserResponseDto?> UpdateDoctorAsync(int id, UpdateDoctorDto updateDoctorDto);
        Task<bool> DeleteDoctorAsync(int id);
        Task<bool> CheckEmailExistAsync(string email);
        Task<bool> CheckIdNumberExistAsync(string idNumber);
    }
}
