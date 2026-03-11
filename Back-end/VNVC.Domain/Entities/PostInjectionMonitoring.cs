using System.ComponentModel.DataAnnotations;

namespace VNVC.Domain.Entities;

public class PostInjectionMonitoring
{
    public int Id { get; set; }
    public int InjectionLogId { get; set; }
    public virtual InjectionLog? InjectionLog { get; set; }

    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    
    [MaxLength(500)]
    public string? ReactionNote { get; set; } // Phản ứng sau tiêm
    public bool IsNormal { get; set; } = true;

    [MaxLength(50)]
    public string Status { get; set; } = "Monitoring"; // Normal, Warning, Finished
}
