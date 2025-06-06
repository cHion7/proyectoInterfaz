            const sampleTransactions = [
                { id: 1, type: 'income', amount: 2500, description: 'Salario', date: '2023-07-01', category: 'salario' },
                { id: 2, type: 'expense', amount: 350, description: 'Supermercado', date: '2023-07-05', category: 'alimentacion' },
                { id: 3, type: 'expense', amount: 120, description: 'Transporte', date: '2023-07-10', category: 'transporte' },
                { id: 4, type: 'income', amount: 500, description: 'Freelance', date: '2023-07-15', category: 'freelance' },
                { id: 5, type: 'expense', amount: 80, description: 'Cine', date: '2023-07-20', category: 'entretenimiento' },
                { id: 6, type: 'expense', amount: 150, description: 'Luz', date: '2023-07-25', category: 'servicios' },
                { id: 7, type: 'income', amount: 300, description: 'Venta mueble', date: '2023-07-28', category: 'otros' },
            ];

            // Variables de estado
            let currentMonth = new Date().getMonth();
            let currentYear = new Date().getFullYear();
            let transactions = [...sampleTransactions];
            let selectedMonth = currentMonth;
            let calendarMonth = currentMonth;
            let calendarYear = currentYear;

            // Inicialización
            document.addEventListener('DOMContentLoaded', function() {
                updateMonthDisplay();
                renderCalendar(calendarMonth, calendarYear);
                updateMonthSummary(selectedMonth, currentYear);
                updateYearSummary(currentYear);
                renderTransactions();
                
                // Event listeners para el carrusel
                document.getElementById('prev-month').addEventListener('click', () => {
                    selectedMonth = selectedMonth > 0 ? selectedMonth - 1 : 11;
                    updateMonthDisplay();
                });

                document.getElementById('next-month').addEventListener('click', () => {
                    selectedMonth = selectedMonth < 11 ? selectedMonth + 1 : 0;
                    updateMonthDisplay();
                });

                // Event listeners para el calendario
                document.getElementById('prev-year').addEventListener('click', () => {
                    currentYear--;
                    updateYearSummary(currentYear);
                });

                document.getElementById('next-year').addEventListener('click', () => {
                    currentYear++;
                    updateYearSummary(currentYear);
                });

                // Event listeners para cambiar mes en calendario
                document.getElementById('prev-month-calendar').addEventListener('click', () => {
                    if (calendarMonth > 0) {
                        calendarMonth--;
                    } else {
                        calendarMonth = 11;
                        calendarYear--;
                    }
                    renderCalendar(calendarMonth, calendarYear);
                });

                document.getElementById('next-month-calendar').addEventListener('click', () => {
                    if (calendarMonth < 11) {
                        calendarMonth++;
                    } else {
                        calendarMonth = 0;
                        calendarYear++;
                    }
                    renderCalendar(calendarMonth, calendarYear);
                });

                // Event listeners para el modal
                document.getElementById('add-transaction').addEventListener('click', () => {
                    document.getElementById('transaction-modal').classList.remove('hidden');
                    // Establecer fecha actual por defecto
                    const today = new Date();
                    document.getElementById('date').value = today.toISOString().split('T')[0];
                });

                document.getElementById('close-modal').addEventListener('click', () => {
                    document.getElementById('transaction-modal').classList.add('hidden');
                });

                document.getElementById('cancel-transaction').addEventListener('click', () => {
                    document.getElementById('transaction-modal').classList.add('hidden');
                });

                document.getElementById('transaction-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    addNewTransaction();
                    document.getElementById('transaction-modal').classList.add('hidden');
                });

                // Tema oscuro/claro
                document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
            });

            // Funciones
            function updateMonthDisplay() {
                const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                document.getElementById('current-month').textContent = monthNames[selectedMonth];
                updateMonthSummary(selectedMonth, currentYear);
            }
            
            function calculateMonthTotal(month, type) {
                const monthTransactions = transactions.filter(trans => {
                    const transDate = new Date(trans.date);
                    return transDate.getMonth() === month && transDate.getFullYear() === currentYear && trans.type === type;
                });
                
                return monthTransactions.reduce((sum, trans) => sum + trans.amount, 0).toFixed(2);
            }
            
            function calculateMonthBalance(month) {
                const incomes = parseFloat(calculateMonthTotal(month, 'income'));
                const expenses = parseFloat(calculateMonthTotal(month, 'expense'));
                return (incomes - expenses).toFixed(2);
            }
            
            function getBalancePercentage(month) {
                const incomes = parseFloat(calculateMonthTotal(month, 'income'));
                const expenses = parseFloat(calculateMonthTotal(month, 'expense'));
                
                if (incomes === 0 && expenses === 0) return 50;
                if (incomes === 0) return 0;
                if (expenses === 0) return 100;
                
                return (incomes / (incomes + expenses)) * 100;
            }
            
            function getBalanceBarColor(month) {
                const balance = parseFloat(calculateMonthBalance(month));
                return balance >= 0 ? 'bg-green-500' : 'bg-red-500';
            }
            
            function scrollToMonth(monthIndex) {
                const monthElement = document.getElementById(`month-${monthIndex}`);
                monthElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                updateMonthCards();
            }
            
            function updateMonthCards() {
                document.querySelectorAll('.month-card').forEach((card, index) => {
                    card.classList.remove('active');
                    if (index === selectedMonth) {
                        card.classList.add('active');
                    }
                });
            }
            
            function renderCalendar(month, year) {
                const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                
                document.getElementById('current-month-calendar').textContent = `${monthNames[month]} ${year}`;
                document.getElementById('current-year').textContent = year;
                
                const calendar = document.getElementById('calendar');
                // Limpiar días existentes (excepto los nombres de los días)
                while (calendar.children.length > 7) {
                    calendar.removeChild(calendar.lastChild);
                }
                
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                
                // Agregar días vacíos para alinear el primer día
                for (let i = 0; i < firstDay; i++) {
                    const emptyDay = document.createElement('div');
                    emptyDay.className = 'h-8 md:h-12';
                    calendar.appendChild(emptyDay);
                }
                
                // Agregar días del mes
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day h-8 md:h-12 flex items-center justify-center cursor-pointer relative';
                    
                    const dayTransactions = getDayTransactions(year, month, day);
                    let dotColor = '';
                    
                    if (dayTransactions.income > 0 && dayTransactions.expense > 0) {
                        dotColor = 'both';
                    } else if (dayTransactions.income > 0) {
                        dotColor = 'green';
                    } else if (dayTransactions.expense > 0) {
                        dotColor = 'red';
                    }
                    
                    dayElement.innerHTML = `
                        <span class="text-xs md:text-sm">${day}</span>
                        ${dotColor === 'both' 
                            ? '<div class="flex justify-center absolute bottom-1 w-full"><span class="day-dot dot-green mr-1"></span><span class="day-dot dot-red"></span></div>' 
                            : dotColor 
                                ? `<span class="day-dot dot-${dotColor}"></span>`
                                : ''}
                    `;
                    
                    // Al hacer clic en un día, mostrar transacciones de ese día
                    if (dotColor) {
                        dayElement.addEventListener('click', () => {
                            const selectedDate = new Date(year, month, day);
                            renderTransactions(selectedDate);
                        });
                    }
                    
                    calendar.appendChild(dayElement);
                }
            }
            
            function getDayTransactions(year, month, day) {
                const dayTransactions = transactions.filter(trans => {
                    const transDate = new Date(trans.date);
                    return transDate.getFullYear() === year && 
                        transDate.getMonth() === month && 
                        transDate.getDate() === day;
                });
                
                return {
                    income: dayTransactions.filter(t => t.type === 'income').length,
                    expense: dayTransactions.filter(t => t.type === 'expense').length
                };
            }
            
            function markTransactionsOnCalendar(year) {
                // Esta función ya está implementada en parte por getDayDots
                // Se mantiene por si queremos añadir más funcionalidades
            }
            
            function updateMonthSummary(month, year) {
                const incomes = parseFloat(calculateMonthTotal(month, 'income'));
                const expenses = parseFloat(calculateMonthTotal(month, 'expense'));
                const balance = incomes - expenses;
                
                document.getElementById('month-income').textContent = incomes.toFixed(2);
                document.getElementById('month-expenses').textContent = expenses.toFixed(2);
                
                const balanceElement = document.getElementById('month-balance');
                balanceElement.textContent = balance.toFixed(2);
                balanceElement.className = `text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`;
            }
            
            function updateYearSummary(year) {
                const yearTransactions = transactions.filter(trans => {
                    const transDate = new Date(trans.date);
                    return transDate.getFullYear() === year;
                });
                
                const totalIncome = yearTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);
                    
                const totalExpenses = yearTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                    
                const balance = totalIncome - totalExpenses;
                
                document.getElementById('year-income').textContent = totalIncome.toFixed(2);
                document.getElementById('year-expenses').textContent = totalExpenses.toFixed(2);
                
                const balanceElement = document.getElementById('year-balance');
                balanceElement.textContent = balance.toFixed(2);
                balanceElement.className = `font-bold ${balance >= 0 ? 'text-indigo-800' : 'text-red-600'}`;
            }
            
            function renderTransactions(date = null) {
                const transactionsContainer = document.getElementById('transactions');
                transactionsContainer.innerHTML = '';
                
                const filteredTransactions = date 
                    ? transactions.filter(trans => trans.date === date.toISOString().split('T')[0])
                    : transactions.slice().reverse().slice(0, 5); // Mostrar las 5 más recientes
                
                if (filteredTransactions.length === 0) {
                    transactionsContainer.innerHTML = `
                        <div class="text-center py-4 text-gray-500">
                            ${date ? 'No hay transacciones en este día' : 'No hay transacciones recientes'}
                        </div>
                    `;
                    return;
                }
                
                filteredTransactions.forEach(trans => {
                    const transElement = document.createElement('div');
                    transElement.className = 'bg-white p-3 rounded-lg shadow-sm flex items-center justify-between border-l-4 ';
                    transElement.classList.add(trans.type === 'income' ? 'border-green-500' : 'border-red-500');
                    
                    transElement.innerHTML = `
                        <div class="flex items-center">
                            <div class="p-2 rounded-full ${trans.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mr-3">
                                <i class="fas ${trans.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                            </div>
                            <div>
                                <p class="font-medium">${trans.description}</p>
                                <p class="text-xs text-gray-500">${formatDate(trans.date)} • ${getCategoryName(trans.category)}</p>
                            </div>
                        </div>
                        <span class="font-semibold ${trans.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                            ${trans.type === 'income' ? '+' : '-'}$${trans.amount.toFixed(2)}
                        </span>
                    `;
                    
                    transactionsContainer.appendChild(transElement);
                });
            }
            
            function formatDate(dateString) {
                const options = { day: 'numeric', month: 'short' };
                return new Date(dateString).toLocaleDateString('es-ES', options);
            }
            
            function getCategoryName(categoryKey) {
                const categories = {
                    'salario': 'Salario',
                    'freelance': 'Freelance',
                    'inversiones': 'Inversiones',
                    'alimentacion': 'Alimentación',
                    'transporte': 'Transporte',
                    'entretenimiento': 'Entretenimiento',
                    'servicios': 'Servicios',
                    'otros': 'Otros'
                };
                return categories[categoryKey] || categoryKey;
            }
            
            function addNewTransaction() {
                const type = document.querySelector('input[name="type"]:checked').value;
                const amount = parseFloat(document.getElementById('amount').value);
                const description = document.getElementById('description').value;
                const date = document.getElementById('date').value;
                const category = document.getElementById('category').value;
                
                if (!amount || !description) {
                    alert('Por favor completa todos los campos requeridos');
                    return;
                }
                
                const newTransaction = {
                    id: transactions.length + 1,
                    type,
                    amount,
                    description,
                    date,
                    category
                };
                
                transactions.push(newTransaction);
                
                // Actualizar las vistas
                renderMonthsCarousel();
                renderCalendar(currentYear);
                updateMonthSummary(selectedMonth, currentYear);
                updateYearSummary(currentYear);
                renderTransactions();
                
                // Limpiar el formulario
                document.getElementById('transaction-form').reset();
            }
            
            function toggleTheme() {
                const html = document.documentElement;
                const themeToggle = document.getElementById('theme-toggle');
                
                if (html.classList.contains('dark')) {
                    html.classList.remove('dark');
                    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                } else {
                    html.classList.add('dark');
                    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                }
            }