using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using TimDongDoi.API.Models;

namespace TimDongDoi.API.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
    public DbSet<Skill> Skills { get; set; } = null!;
        public DbSet<UserSkill> UserSkills { get; set; } = null!;
    // --- Các DbSet (Giữ nguyên) ---
    public virtual DbSet<AdminLog> AdminLogs { get; set; }
    public virtual DbSet<Application> Applications { get; set; }
    public virtual DbSet<ApplicationTest> ApplicationTests { get; set; }
    // ... (Giữ nguyên các DbSet khác) ...
    public virtual DbSet<User> Users { get; set; }
    // ... (Giữ nguyên các DbSet khác) ...
    // Thêm các DbSet này
public virtual DbSet<Company> Companies { get; set; }
public virtual DbSet<CompanyLocation> CompanyLocations { get; set; }
public virtual DbSet<CompanyVerification> CompanyVerifications { get; set; }
public virtual DbSet<UserExperience> UserExperiences { get; set; }
public virtual DbSet<UserEducation> UserEducations { get; set; }
public virtual DbSet<Job> Jobs { get; set; }
public virtual DbSet<JobSkill> JobSkills { get; set; }
public virtual DbSet<SavedJob> SavedJobs { get; set; }
public virtual DbSet<Test> Tests { get; set; }
public virtual DbSet<TestQuestion> TestQuestions { get; set; }
public virtual DbSet<JobTest> JobTests { get; set; }
public virtual DbSet<Interview> Interviews { get; set; }
public virtual DbSet<Project> Projects { get; set; }
public virtual DbSet<ProjectPosition> ProjectPositions { get; set; }
public virtual DbSet<ProjectPositionSkill> ProjectPositionSkills { get; set; }
public virtual DbSet<ProjectApplication> ProjectApplications { get; set; }
public virtual DbSet<ProjectMember> ProjectMembers { get; set; }
public virtual DbSet<Review> Reviews { get; set; }
public virtual DbSet<Notification> Notifications { get; set; }
public virtual DbSet<Message> Messages { get; set; }
public virtual DbSet<Report> Reports { get; set; }

    // ❌ ĐÃ XÓA: Phương thức OnConfiguring đã bị xóa. Ứng dụng sẽ đọc chuỗi kết nối
    // từ Program.cs (builder.Services.AddDbContext)

    // ============================================
// PHẦN OnModelCreating ĐÃ SỬA
// Copy toàn bộ phần này thay thế OnModelCreating hiện tại
// ============================================

protected override void OnModelCreating(ModelBuilder modelBuilder)
{   
    // ==================== MESSAGE ====================
    modelBuilder.Entity<Message>(entity =>
    {
        entity.HasOne(m => m.FromUser)
              .WithMany(u => u.MessageFromUsers)
              .HasForeignKey(m => m.FromUserId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_Messages_FromUser");

        entity.HasOne(m => m.ToUser)
              .WithMany(u => u.MessageToUsers)
              .HasForeignKey(m => m.ToUserId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_Messages_ToUser");
    });

    // ==================== USER ====================
    modelBuilder.Entity<User>(entity =>
    {
        entity.HasKey(e => e.Id).HasName("PK__users__3213E83FB30C90E4");
        entity.ToTable("users");

        entity.HasIndex(e => e.Email, "UQ__users__AB6E6164ED331F57").IsUnique();
        entity.HasIndex(e => e.Email, "idx_users_email");
        entity.HasIndex(e => e.Role, "idx_users_role");
        entity.HasIndex(e => e.Status, "idx_users_status");

        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.AboutMe).HasColumnName("about_me");
        entity.Property(e => e.Address).HasMaxLength(255).HasColumnName("address");
        entity.Property(e => e.Avatar).HasMaxLength(255).HasColumnName("avatar");
        entity.Property(e => e.Birthday).HasColumnName("birthday");
        entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())").HasColumnName("created_at");
        entity.Property(e => e.CvFile).HasMaxLength(255).HasColumnName("cv_file");
        entity.Property(e => e.Email).HasMaxLength(100).HasColumnName("email");
        entity.Property(e => e.FullName).HasMaxLength(100).HasColumnName("full_name");
        entity.Property(e => e.Gender).HasMaxLength(10).HasColumnName("gender");
        entity.Property(e => e.JobTitle).HasMaxLength(100).HasColumnName("job_title");
        entity.Property(e => e.Phone).HasMaxLength(20).HasColumnName("phone");
        entity.Property(e => e.Role).HasMaxLength(20).HasDefaultValue("user").HasColumnName("role");
        entity.Property(e => e.SalaryExpectation).HasColumnName("salary_expectation");
        entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("active").HasColumnName("status");
        entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())").HasColumnName("updated_at");
    });

    // ==================== SKILL ====================
    modelBuilder.Entity<Skill>(entity =>
    {
        entity.ToTable("skills");
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.Name).HasColumnName("name");
        entity.Property(e => e.Category).HasColumnName("category");
        entity.Property(e => e.Icon).HasColumnName("icon");
        entity.Property(e => e.Popularity).HasColumnName("popularity");
        entity.Property(e => e.CreatedAt).HasColumnName("created_at");
    });

    // ==================== USER SKILL ====================
 modelBuilder.Entity<UserSkill>(entity =>
    {
        entity.ToTable("user_skills");
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.UserId).HasColumnName("user_id");
        entity.Property(e => e.SkillId).HasColumnName("skill_id"); 
        entity.Property(e => e.Level).HasColumnName("level");
        
        // Sửa lỗi cảnh báo thập phân
        entity.Property(e => e.YearsExperience).HasColumnName("years_experience").HasColumnType("decimal(18, 2)"); 
        
        entity.Property(e => e.Description).HasColumnName("description");
        entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

        // Dòng này triệt tiêu lỗi SkillId1
        entity.HasOne(us => us.Skill).WithMany().HasForeignKey(us => us.SkillId).OnDelete(DeleteBehavior.Cascade);
        entity.HasOne(us => us.User).WithMany(u => u.UserSkills).HasForeignKey(us => us.UserId).OnDelete(DeleteBehavior.Cascade);
    });
    // ==================== COMPANY ====================
    modelBuilder.Entity<Company>(entity =>
    {
        entity.ToTable("companies");
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.UserId).HasColumnName("user_id");
        entity.Property(e => e.Name).HasMaxLength(200).HasColumnName("name");
        entity.Property(e => e.Logo).HasMaxLength(255).HasColumnName("logo");
        entity.Property(e => e.Description).HasColumnName("description");
        entity.Property(e => e.Website).HasMaxLength(255).HasColumnName("website");
        entity.Property(e => e.Industry).HasMaxLength(100).HasColumnName("industry");
        entity.Property(e => e.Size).HasMaxLength(50).HasColumnName("size");
        entity.Property(e => e.FoundedYear).HasColumnName("founded_year");
        entity.Property(e => e.VerificationStatus).HasMaxLength(20).HasDefaultValue("pending").HasColumnName("verification_status");
        entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())").HasColumnName("created_at");
        entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

        entity.HasOne(d => d.User).WithOne(p => p.Company)
            .HasForeignKey<Company>(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    });

    // ==================== COMPANY LOCATION ====================
    modelBuilder.Entity<CompanyLocation>(entity =>
    {
        entity.ToTable("company_locations");
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.CompanyId).HasColumnName("company_id");
        entity.Property(e => e.Address).HasColumnName("address");
        entity.Property(e => e.City).HasColumnName("city");
        entity.Property(e => e.Country).HasColumnName("country");
        entity.Property(e => e.IsHeadquarter).HasColumnName("is_headquarter");
        entity.Property(e => e.CreatedAt).HasColumnName("created_at");
    });

    // ==================== COMPANY VERIFICATION ====================
    modelBuilder.Entity<CompanyVerification>(entity =>
    {
        entity.ToTable("company_verifications");
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.CompanyId).HasColumnName("company_id");
        entity.Property(e => e.VerifiedBy).HasColumnName("verified_by");
        entity.Property(e => e.DocumentType).HasMaxLength(50).HasColumnName("document_type");
        entity.Property(e => e.DocumentUrl).HasMaxLength(255).HasColumnName("document_url");
        entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("pending").HasColumnName("status");
        entity.Property(e => e.Notes).HasColumnName("notes");
        entity.Property(e => e.SubmittedAt).HasDefaultValueSql("(getdate())").HasColumnName("submitted_at");
        entity.Property(e => e.VerifiedAt).HasColumnName("verified_at");

        entity.HasOne(d => d.Company).WithMany(p => p.CompanyVerifications)
            .HasForeignKey(d => d.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.CompanyVerifications)
            .HasForeignKey(d => d.VerifiedBy)
            .OnDelete(DeleteBehavior.NoAction);
    });

    // ==================== JOB ====================
    modelBuilder.Entity<Job>(entity =>
    {
        entity.ToTable("jobs");
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.CompanyId).HasColumnName("company_id");
        entity.Property(e => e.Title).HasMaxLength(200).HasColumnName("title");
        entity.Property(e => e.Description).HasColumnName("description");
        entity.Property(e => e.Requirements).HasColumnName("requirements");
        entity.Property(e => e.Benefits).HasColumnName("benefits");
        entity.Property(e => e.Type).HasMaxLength(20).HasColumnName("type");
        entity.Property(e => e.Level).HasMaxLength(20).HasColumnName("level");
        entity.Property(e => e.SalaryMin).HasColumnName("salary_min");
        entity.Property(e => e.SalaryMax).HasColumnName("salary_max");
        entity.Property(e => e.SalaryCurrency).HasMaxLength(10).HasDefaultValue("VND").HasColumnName("salary_currency");
        entity.Property(e => e.Location).HasMaxLength(255).HasColumnName("location");
        entity.Property(e => e.LocationType).HasMaxLength(20).HasColumnName("location_type");
        entity.Property(e => e.Positions).HasDefaultValue(1).HasColumnName("positions");
        entity.Property(e => e.Deadline).HasColumnName("deadline");
        entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("open").HasColumnName("status");
        entity.Property(e => e.Views).HasDefaultValue(0).HasColumnName("views");
        entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())").HasColumnName("created_at");
        entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())").HasColumnName("updated_at");

        entity.HasOne(d => d.Company).WithMany(p => p.Jobs)
            .HasForeignKey(d => d.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);
    });

    // ==================== JOB SKILL ====================
    modelBuilder.Entity<JobSkill>(entity =>
    {
        entity.ToTable("job_skills");
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.JobId).HasColumnName("job_id");
        entity.Property(e => e.SkillId).HasColumnName("skill_id");
        entity.Property(e => e.IsRequired).HasDefaultValue(true).HasColumnName("is_required");
        entity.Property(e => e.Level).HasMaxLength(20).HasColumnName("level");

        entity.HasOne(d => d.Job).WithMany(p => p.JobSkills)
            .HasForeignKey(d => d.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(d => d.Skill).WithMany(p => p.JobSkills)
            .HasForeignKey(d => d.SkillId)
            .OnDelete(DeleteBehavior.Cascade);
    });

    // ==================== SAVED JOB ====================
    modelBuilder.Entity<SavedJob>(entity =>
    {
        entity.ToTable("saved_jobs");
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.UserId).HasColumnName("user_id");
        entity.Property(e => e.JobId).HasColumnName("job_id");
        entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())").HasColumnName("created_at");

        entity.HasOne(d => d.User).WithMany(p => p.SavedJobs)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.HasOne(d => d.Job).WithMany(p => p.SavedJobs)
            .HasForeignKey(d => d.JobId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.HasIndex(e => new { e.UserId, e.JobId }).IsUnique();
    });

    // ==================== FIX LỖI CASCADE CHO JOB TEST ====================
    modelBuilder.Entity<JobTest>(entity =>
    {
        entity.ToTable("JobTests");
        
        // Tắt xóa dây chuyền từ Job -> JobTest
        entity.HasOne(d => d.Job)
              .WithMany() // Để trống bên trong cho an toàn (tránh lỗi nếu Model Job không có List)
              .HasForeignKey(d => d.JobId)
              .OnDelete(DeleteBehavior.NoAction);

        // Tắt xóa dây chuyền từ Test -> JobTest
        entity.HasOne(d => d.Test)
              .WithMany()
              .HasForeignKey(d => d.TestId)
              .OnDelete(DeleteBehavior.NoAction);
    });
    // ==================== APPLICATION ====================
    modelBuilder.Entity<Application>(entity =>
    {
        entity.ToTable("applications");
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.UserId).HasColumnName("user_id");
        entity.Property(e => e.JobId).HasColumnName("job_id");
        entity.Property(e => e.CoverLetter).HasColumnName("cover_letter");
        entity.Property(e => e.CvFile).HasMaxLength(255).HasColumnName("cv_file");
        entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("pending").HasColumnName("status");
        entity.Property(e => e.RejectReason).HasColumnName("reject_reason");
        entity.Property(e => e.AppliedAt).HasDefaultValueSql("(getdate())").HasColumnName("applied_at");
        entity.Property(e => e.UpdatedAt).HasDefaultValueSql("(getdate())").HasColumnName("updated_at");

        entity.HasOne(d => d.User).WithMany(p => p.Applications)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.HasOne(d => d.Job).WithMany(p => p.Applications)
            .HasForeignKey(d => d.JobId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.HasIndex(e => new { e.UserId, e.JobId }).IsUnique();
    });


// ==================== PROJECT ====================
    modelBuilder.Entity<Project>(entity =>
    {
        entity.ToTable("projects");
        entity.HasKey(e => e.Id);
        
        entity.Property(e => e.Id).HasColumnName("id");
        entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
        entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(200).IsRequired();
        entity.Property(e => e.Description).HasColumnName("description").IsRequired();
        entity.Property(e => e.Type).HasColumnName("type").HasMaxLength(20);
        entity.Property(e => e.DurationMonths).HasColumnName("duration_months");
        entity.Property(e => e.LocationType).HasColumnName("location_type").HasMaxLength(20);
        entity.Property(e => e.CompensationType).HasColumnName("compensation_type").HasMaxLength(20);
        entity.Property(e => e.CompensationDetails).HasColumnName("compensation_details");
        entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).HasDefaultValue("open");
        entity.Property(e => e.Views).HasColumnName("views").HasDefaultValue(0);
        entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        
        entity.HasIndex(e => e.Status);
        entity.HasIndex(e => e.Type);
        entity.HasIndex(e => e.UserId);

        // ĐÃ XÓA DÒNG LỖI: entity.Ignore(e => e.User);
        
        // THÊM ĐOẠN NÀY ĐỂ FIX LỖI INCLUDE VÀ NHẬN DIỆN KHÓA NGOẠI
        entity.HasOne(p => p.User)
              .WithMany(u => u.Projects) // Để trống WithMany() là an toàn nhất nếu Model User không chứa List<Project>
              .HasForeignKey(p => p.UserId)
              .OnDelete(DeleteBehavior.Cascade);
    });

    // ==================== PROJECT POSITION ====================
  modelBuilder.Entity<ProjectPosition>(entity =>
{
    entity.ToTable("project_positions");
    entity.HasKey(e => e.Id);
    
    entity.Property(e => e.Id).HasColumnName("id");
    entity.Property(e => e.ProjectId).HasColumnName("project_id");
    entity.Property(e => e.Role).HasColumnName("role").HasMaxLength(100).IsRequired();
    entity.Property(e => e.Quantity).HasColumnName("quantity").HasDefaultValue(1);
    entity.Property(e => e.Requirements).HasColumnName("requirements");
    entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).HasDefaultValue("open");
    entity.Property(e => e.CreatedAt).HasColumnName("created_at");
    
    // XÓA HasOne/WithMany - để EF tự nhận diện
});

    // ==================== PROJECT POSITION SKILL ====================
 modelBuilder.Entity<ProjectPositionSkill>(entity =>
{
    entity.ToTable("project_position_skills");
    entity.HasKey(e => e.Id);
    
    entity.Property(e => e.Id).HasColumnName("id");
    entity.Property(e => e.PositionId).HasColumnName("position_id");
    entity.Property(e => e.SkillId).HasColumnName("skill_id");
    entity.Property(e => e.IsRequired).HasColumnName("is_required").HasDefaultValue(true);
    
    // --- PHẢI CÓ các dòng này để sửa lỗi SkillId1 ---

    // 1. Quan hệ với ProjectPosition (1 Vị trí có nhiều Kỹ năng yêu cầu)
    entity.HasOne(pps => pps.Position)
          .WithMany(p => p.ProjectPositionSkills) // Khớp với ICollection trong ProjectPosition.cs
          .HasForeignKey(pps => pps.PositionId)
          .OnDelete(DeleteBehavior.Cascade);
    
    // 2. Quan hệ với Skill (Cực kỳ quan trọng để triệt tiêu SkillId1)
    entity.HasOne(pps => pps.Skill)
          .WithMany() // Nếu file Skill.cs của bạn không có danh sách ngược lại
          .HasForeignKey(pps => pps.SkillId) // Chỉ định rõ skill_id là khóa ngoại
          .OnDelete(DeleteBehavior.Cascade);
});

    // ==================== PROJECT APPLICATION ====================
   modelBuilder.Entity<ProjectApplication>(entity =>
{
    entity.ToTable("project_applications");
    entity.HasKey(e => e.Id);
    
    entity.Property(e => e.Id).HasColumnName("id");
    entity.Property(e => e.ProjectId).HasColumnName("project_id");
    entity.Property(e => e.PositionId).HasColumnName("position_id");
    entity.Property(e => e.UserId).HasColumnName("user_id");
    entity.Property(e => e.CoverLetter).HasColumnName("cover_letter");
    entity.Property(e => e.PortfolioLink).HasColumnName("portfolio_link").HasMaxLength(500);
    entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).HasDefaultValue("pending");
    entity.Property(e => e.AppliedAt).HasColumnName("applied_at");
    entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
    
    // XÓA các HasOne/
    entity.HasOne(pa => pa.Project)
              .WithMany(p => p.ProjectApplications)
              .HasForeignKey(pa => pa.ProjectId)
              .OnDelete(DeleteBehavior.NoAction);

        entity.HasOne(pa => pa.Position)
              .WithMany(p => p.ProjectApplications)
              .HasForeignKey(pa => pa.PositionId)
              .OnDelete(DeleteBehavior.NoAction);

        entity.HasOne(pa => pa.User)
              .WithMany(u => u.ProjectApplications)
              .HasForeignKey(pa => pa.UserId)
              .OnDelete(DeleteBehavior.NoAction);
});
    // ==================== PROJECT MEMBER ====================
   modelBuilder.Entity<ProjectMember>(entity =>
{
    entity.ToTable("project_members");
    entity.HasKey(e => e.Id);
    
    entity.Property(e => e.Id).HasColumnName("id");
    entity.Property(e => e.ProjectId).HasColumnName("project_id");
    entity.Property(e => e.UserId).HasColumnName("user_id");
    entity.Property(e => e.PositionId).HasColumnName("position_id");
    entity.Property(e => e.RoleType).HasColumnName("role_type").HasMaxLength(20).HasDefaultValue("member");
    entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).HasDefaultValue("active");
    entity.Property(e => e.JoinedAt).HasColumnName("joined_at");
    entity.Property(e => e.LeftAt).HasColumnName("left_at");
    
    // XÓA các HasOne/WithMany
    // CHẶN XÓA DÂY CHUYỀN TẠI ĐÂY (Phòng ngừa lỗi tiếp theo)
        entity.HasOne(pm => pm.Project)
              .WithMany(p => p.ProjectMembers)
              .HasForeignKey(pm => pm.ProjectId)
              .OnDelete(DeleteBehavior.NoAction);

        entity.HasOne(pm => pm.User)
              .WithMany(u => u.ProjectMembers)
              .HasForeignKey(pm => pm.UserId)
              .OnDelete(DeleteBehavior.NoAction);
});

    
// ==================== REVIEW ====================
    modelBuilder.Entity<Review>(entity =>
    {
        entity.ToTable("Reviews"); // Đổi thành "reviews" nếu bảng trong SQL của bạn viết thường
        entity.HasKey(e => e.Id);

        // KHÔNG CÓ BẤT KỲ DÒNG HasColumnName NÀO Ở ĐÂY NỮA, ĐỂ EF CORE TỰ LẤY TÊN GỐC (VD: FromUserId)

        entity.HasOne(d => d.Application)
              .WithMany(a => a.Reviews) 
              .HasForeignKey(d => d.ApplicationId);

        entity.HasOne(d => d.ProjectMember)
              .WithMany()
              .HasForeignKey(d => d.ProjectMemberId);

        entity.HasOne(d => d.FromUser) 
              .WithMany() 
              .HasForeignKey(d => d.FromUserId)
              .OnDelete(DeleteBehavior.NoAction); 

        entity.HasOne(d => d.ToUser) 
              .WithMany() 
              .HasForeignKey(d => d.ToUserId)
              .OnDelete(DeleteBehavior.NoAction);
    });

    
    OnModelCreatingPartial(modelBuilder);
}

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}