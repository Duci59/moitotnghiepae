/**
 * YEARBOOK INVITATION - INTERACTIVE SCRIPT
 * Author: Anne John
 * Niên khóa 2020 - 2026
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // KHAI BÁO CÁC PHẦN TỬ DOM
    // ==========================================================================
    const envelopeWrapper = document.getElementById("envelopeWrapper");
    const waxSeal = document.getElementById("waxSeal");
    
    // ==========================================================================
    // 1. LOGIC XỬ LÝ PHONG BÌ (MỞ/ĐÓNG THIỆP MỜI)
    // ==========================================================================
    let isEnvelopeOpened = false;

    waxSeal.addEventListener("click", () => {
        if (!isEnvelopeOpened) {
            // Mở phong bì
            document.body.classList.add("opened");
            envelopeWrapper.classList.add("opened");
            isEnvelopeOpened = true;
            
            // Kích hoạt hiệu ứng pháo hoa Confetti chúc mừng
            triggerConfetti();

            // Cuộn màn hình xuống nhẹ nhàng sau khi mở để tập trung vào thiệp mời
            setTimeout(() => {
                const rect = document.getElementById("invitationCard").getBoundingClientRect();
                window.scrollBy({
                    top: rect.top - 20,
                    behavior: "smooth"
                });
            }, 1000);
        }
    });

    // ==========================================================================
    // 2. ENGINE BẮN PHÁO HOA GIẤY (CONFETTI PARTICLE SYSTEM)
    // ==========================================================================
    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas.getContext("2d");
    
    let confettiParticles = [];
    let animationFrameId = null;
    let isConfettiRunning = false;
    
    const colors = [
        "#E8A0A7", // Hồng nhạt sáp
        "#1D3557", // Navy
        "#D4AF37", // Vàng ánh kim
        "#2E4C7E", // Navy sáng
        "#FADBD8"  // Hồng sữa
    ];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);

    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            // Bắn từ bên dưới tầm phong bì lên trên
            this.y = canvas.height * 0.7;
            this.size = Math.random() * 8 + 5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            // Lực bắn ban đầu (vút lên trên và bung ra hai bên)
            this.vx = Math.random() * 12 - 6;
            this.vy = -(Math.random() * 15 + 10);
            
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            
            this.gravity = 0.4;
            this.opacity = 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            
            // Lực gió nhẹ lay động
            this.vx += Math.sin(this.y / 20) * 0.1;
            
            this.rotation += this.rotationSpeed;
            
            // Giảm độ mờ khi rơi xuống gần đáy màn hình
            if (this.vy > 0) {
                this.opacity -= 0.015;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            
            // Vẽ các mẩu giấy confetti hình chữ nhật nhỏ
            ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            
            ctx.restore();
        }
    }

    function triggerConfetti(particleCount = 100) {
        resizeCanvas();
        canvas.style.display = "block";
        
        for (let i = 0; i < particleCount; i++) {
            confettiParticles.push(new Confetti());
        }
        
        if (!isConfettiRunning) {
            isConfettiRunning = true;
            animateConfetti();
        }
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Cập nhật và vẽ từng mẩu confetti
        for (let i = confettiParticles.length - 1; i >= 0; i--) {
            const p = confettiParticles[i];
            p.update();
            p.draw();
            
            // Xóa hạt đã biến mất khỏi danh sách
            if (p.opacity <= 0 || p.y > canvas.height) {
                confettiParticles.splice(i, 1);
            }
        }
        
        if (confettiParticles.length > 0) {
            animationFrameId = requestAnimationFrame(animateConfetti);
        } else {
            isConfettiRunning = false;
            canvas.style.display = "none";
            cancelAnimationFrame(animationFrameId);
        }
    }

});
