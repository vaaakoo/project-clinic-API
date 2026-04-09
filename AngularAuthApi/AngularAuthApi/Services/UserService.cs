namespace AngularAuthApi.Services
{
    public class UserService(AppDbContext context) : IUserService
    {
        public async Task<bool> RegisterUserAsync(RegisterUserDto dto)
        {
            var activationCodeEntity = await context.ActivationCodes
                .FirstOrDefaultAsync(ac => ac.Email == dto.Email && ac.Code == dto.activationcode && !ac.Used && ac.ExpirationTime > DateTime.Now);

            if (activationCodeEntity == null) return false;

            var user = new User
            {
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                IdNumber = dto.IdNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "client"
            };

            activationCodeEntity.Used = true;
            context.ActivationCodes.Update(activationCodeEntity);
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RegisterDoctorAsync(RegisterDoctorDto dto)
        {
            var user = new User
            {
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                IdNumber = dto.IdNumber,
                Category = dto.Category,
                ImageUrl = dto.ImageUrl,
                CvUrl = dto.CvUrl,
                starNum = dto.starNum ?? 0,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "doctor"
            };

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<List<UserResponseDto>> GetAllDoctorsAsync()
        {
            var doctors = await context.Users
                .Where(u => u.Category != null)
                .ToListAsync();

            return doctors.Select(MapToResponseDto).ToList();
        }

        public async Task<UserResponseDto?> GetDoctorByIdAsync(int id)
        {
            var doctor = await context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Category != null);
            return doctor != null ? MapToResponseDto(doctor) : null;
        }

        public async Task<UserResponseDto?> GetDoctorByIdNumberAsync(string idNumber)
        {
            var doctor = await context.Users.FirstOrDefaultAsync(u => u.IdNumber == idNumber && u.Category != null);
            return doctor != null ? MapToResponseDto(doctor) : null;
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(int id)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == id);
            return user != null ? MapToResponseDto(user) : null;
        }

        public async Task<UserResponseDto?> GetClientByIdNumberAsync(string idNumber)
        {
            var client = await context.Users.FirstOrDefaultAsync(u => u.IdNumber == idNumber);
            return client != null ? MapToResponseDto(client) : null;
        }

        public async Task<UserResponseDto?> UpdateDoctorAsync(int id, UpdateDoctorDto dto)
        {
            var existingDoctor = await context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Category != null);
            if (existingDoctor == null) return null;

            if (!string.IsNullOrEmpty(dto.FirstName)) existingDoctor.FirstName = dto.FirstName;
            if (!string.IsNullOrEmpty(dto.LastName)) existingDoctor.LastName = dto.LastName;
            if (!string.IsNullOrEmpty(dto.Email)) existingDoctor.Email = dto.Email;
            if (!string.IsNullOrEmpty(dto.IdNumber)) existingDoctor.IdNumber = dto.IdNumber;
            if (!string.IsNullOrEmpty(dto.Category)) existingDoctor.Category = dto.Category;
            if (dto.starNum.HasValue) existingDoctor.starNum = dto.starNum.Value;
            if (!string.IsNullOrEmpty(dto.ImageUrl)) existingDoctor.ImageUrl = dto.ImageUrl;
            if (!string.IsNullOrEmpty(dto.CvUrl)) existingDoctor.CvUrl = dto.CvUrl;

            if (!string.IsNullOrEmpty(dto.Password))
            {
                existingDoctor.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            await context.SaveChangesAsync();
            return MapToResponseDto(existingDoctor);
        }

        public async Task<bool> DeleteDoctorAsync(int id)
        {
            var doctor = await context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Category != null);
            if (doctor == null) return false;

            context.Users.Remove(doctor);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckEmailExistAsync(string email)
        {
            return await context.Users.AnyAsync(x => x.Email == email);
        }

        public async Task<bool> CheckIdNumberExistAsync(string idNumber)
        {
            if (string.IsNullOrEmpty(idNumber) || idNumber.Length != 11 || !idNumber.All(char.IsDigit))
            {
                return true; 
            }

            return await context.Users.AnyAsync(x => x.IdNumber == idNumber);
        }

        private static UserResponseDto MapToResponseDto(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IdNumber = user.IdNumber,
                Category = user.Category,
                starNum = user.starNum,
                ImageUrl = user.ImageUrl,
                CvUrl = user.CvUrl,
                IsAdmin = user.IsAdmin
            };
        }
    }
}
