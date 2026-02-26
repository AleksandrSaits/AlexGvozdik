// Дебounce для оптимизации производительности
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ПРЕЛОАДЕР
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500); // Уменьшил время до 1.5 секунд
    }
});

// ПРОГРЕСС-БАР СКРОЛЛА
window.addEventListener('scroll', debounce(() => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = scrolled + '%';
    }
}, 10));

// КНОПКА НАВЕРХ
const scrollTopBtn = document.querySelector('.scroll-top');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// НАВИГАЦИЯ СКРОЛЛ (изменение фона)
window.addEventListener('scroll', debounce(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}, 10));

// МОБИЛЬНОЕ МЕНЮ
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            body.style.overflow = '';
        }
    });

    // ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ НА ССЫЛКУ
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    navLinks.classList.remove('active');
                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    body.style.overflow = '';
                    
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ ВНЕ ЕГО
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            body.style.overflow = '';
        }
    });
}

// АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ
const fadeElements = document.querySelectorAll('.fade-up');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    observer.observe(element);
});

// ПАРТИКЛЫ
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Очищаем контейнер
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = Math.random() * 10 + 15 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ЭФФЕКТ НАКЛОНА ДЛЯ КАРТОЧЕК (TILT)
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ФОРМА И МОДАЛЬНОЕ ОКНО
const contactForm = document.getElementById('contactForm');
const modal = document.getElementById('messengerModal');
const modalClose = document.querySelector('.modal-close');

// Данные для мессенджЕРОВ
const messengerLinks = {
    telegram: (name, email, message) => {
        const text = `Здравствуйте! Меня зовут ${name}.%0AEmail: ${email}%0A%0A${message}`;
        return `https://t.me/nik_gvozdik?text=${text}`;
    },
    whatsapp: (name, email, message) => {
        const text = `Здравствуйте! Меня зовут ${name}. Email: ${email}. ${message}`;
        return `https://wa.me/79013455505?text=${encodeURIComponent(text)}`;
    },
    email: (name, email, message) => {
        const subject = `Новый проект от ${name}`;
        const body = `Имя: ${name}%0AEmail: ${email}%0A%0A${message}`;
        return `mailto:nikkkkk12345@mail.ru?subject=${encodeURIComponent(subject)}&body=${body}`;
    }
};

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!name || !email || !message) {
            showNotification('Пожалуйста, заполните все поля', 'error');
            return;
        }
        
        if (!emailRegex.test(email)) {
            showNotification('Пожалуйста, введите корректный email', 'error');
            return;
        }
        
        if (message.length < 10) {
            showNotification('Сообщение должно содержать минимум 10 символов', 'error');
            return;
        }
        
        // Сохраняем данные в localStorage
        localStorage.setItem('contactName', name);
        localStorage.setItem('contactEmail', email);
        localStorage.setItem('contactMessage', message);
        
        // Показываем модальное окно
        modal.classList.add('active');
        body.style.overflow = 'hidden';
    });
}

// Обработчики для мессенджеров
document.querySelectorAll('.messenger-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        const messenger = item.dataset.messenger;
        const name = localStorage.getItem('contactName') || '';
        const email = localStorage.getItem('contactEmail') || '';
        const message = localStorage.getItem('contactMessage') || '';
        
        if (messengerLinks[messenger]) {
            const url = messengerLinks[messenger](name, email, message);
            window.open(url, '_blank');
            
            // Закрываем модальное окно
            modal.classList.remove('active');
            body.style.overflow = '';
            
            // Очищаем форму
            contactForm.reset();
            
            // Очищаем localStorage
            localStorage.removeItem('contactName');
            localStorage.removeItem('contactEmail');
            localStorage.removeItem('contactMessage');
            
            showNotification('Спасибо! Сообщение отправлено', 'success');
        }
    });
});

// Закрытие модального окна
if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        body.style.overflow = '';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        body.style.overflow = '';
    }
});

// Функция показа уведомлений
function showNotification(message, type) {
    // Удаляем предыдущее уведомление если есть
    let notification = document.querySelector('.notification');
    
    if (notification) {
        notification.remove();
    }
    
    // Создаем новое уведомление
    notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', debounce(highlightNavigation, 50));

// СКАЧИВАНИЕ РЕЗЮМЕ
document.getElementById('downloadCV')?.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('Функция скачивания резюме будет доступна позже', 'success');
});

// ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ЭКРАНА
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});

// ПОДДЕРЖКА TOUCH-СОБЫТИЙ
document.addEventListener('touchmove', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });

// ПРОВЕРКА НАЛИЧИЯ ТАЧ-ЭКРАНА
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
};

if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// ОПТИМИЗАЦИЯ ЗАГРУЗКИ
document.addEventListener('DOMContentLoaded', () => {
    // Проверка на сохранение трафика
    if ('connection' in navigator && navigator.connection.saveData === true) {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.setAttribute('loading', 'eager');
        });
    }
    
    // Инициализация
    highlightNavigation();
    
    // Добавляем класс видимости для элементов на первом экране
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 200);
});

// ПЛАВНАЯ ПРОКРУТКА ДЛЯ ВСЕХ ЯКОРЕЙ
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// АНИМАЦИЯ ДЛЯ КАРТОЧЕК ПРИ ХОВЕРЕ (БЕЗ TILT)
const cards = document.querySelectorAll('.exp-card, .client-card, .value-item');
cards.forEach(card => {
    if (!card.hasAttribute('data-tilt')) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    }
});

// ПЕРЕЗАПУСК ПАРТИКЛОВ ПРИ ИЗМЕНЕНИИ РАЗМЕРА ЭКРАНА
window.addEventListener('resize', debounce(() => {
    createParticles();
}, 200));

// ОБРАБОТКА КЛАВИШИ ESC ДЛЯ ЗАКРЫТИЯ МОДАЛКИ
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        body.style.overflow = '';
    }
});

// ОБРАБОТКА ДЛЯ ССЫЛОК В ФУТЕРЕ
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Ссылки на соцсети будут добавлены позже', 'success');
    });
});

// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
window.addEventListener('load', function() {
    // Убираем класс visible с hero элементов если они уже видны
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-up').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
});
