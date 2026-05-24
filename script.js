document.addEventListener('DOMContentLoaded', () => {
    const databaseId = 'bcfee19c-fefc-4dd9-9c0a-bc4110c59c3d';
    const form = document.getElementById('waitlist-form');
    const messageEl = document.getElementById('form-message');
    const countNumberEl = document.getElementById('count-number');

    // Fetch current count
    async function updateCount() {
        try {
            const response = await fetch(`https://app.baget.ai/api/public/databases/${databaseId}/count`);
            if (response.ok) {
                const data = await response.json();
                // Add a small seed for launch feeling
                countNumberEl.textContent = data.count + 42;
            }
        } catch (error) {
            console.error('Error fetching count:', error);
            countNumberEl.textContent = 'MANY';
        }
    }

    updateCount();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'SUBMITTING...';

        const formData = new FormData(form);
        const payload = {
            data: {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                source: 'landing_page_waitlist'
            }
        };

        try {
            const response = await fetch(`https://app.baget.ai/api/public/databases/${databaseId}/rows`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                messageEl.textContent = 'WELCOME TO THE LAB. WE WILL BE IN TOUCH SOON.';
                messageEl.style.color = 'green';
                form.reset();
                updateCount();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            messageEl.textContent = 'ERROR SUBMITTING. PLEASE TRY AGAIN.';
            messageEl.style.color = 'var(--accent)';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'GET PRIORITY ACCESS';
        }
    });
});
