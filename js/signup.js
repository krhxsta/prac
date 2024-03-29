const test_email = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
const test_password = /^([A-Za-z1234567890!@#$%^&*()]){6,12}$/;
const test_korean = /^([가-힣\s]){3,12}$/;
//  \s는 공백 포함

// 이용약관 불러오는 코드 챗gpt 작품,,
// $(document).ready(function () {
//     $.ajax({
//         url: '/public/terms.txt',
//         success: function (data) {
//             $('.terms').text(data);
//         },
//         error: function () {
//             $('.terms').text('파일을 불러오는 데 실패했습니다.');
//         },
//     });
// });

document.addEventListener('DOMContentLoaded', function (event) {
    event.preventDefault();
    fetch('/public/terms.txt')
        .then((response) => response.text())
        .then((t_text) => {
            document.querySelector('.terms').innerHTML = t_text;
        })
        .catch((error) => console.error('Error', error));
});

// input 정규식 체크 결과에 따라 font-awesome 폰트 변경
function showXMark(input_val, check, str) {
    let f_inp = '#f-' + input_val;
    let showEye = '#f-show-' + input_val;
    $(showEye).addClass('show-o');
    $(f_inp).addClass('show-o');

    switch (str) {
        case 'login':
            check ? $(f_inp).removeClass('fa-xmark') : $(f_inp).addClass('fa-xmark');
            break;

        default:
            if (check) {
                $(f_inp).removeClass('fa-xmark red');
                $(f_inp).addClass('fa-check green');
            } else {
                $(f_inp).removeClass('fa-check green');
                $(f_inp).addClass('fa-xmark red');
            }
            break;
    }
}

function toggleEye(a, b) {}

// signup page에서 로그인 모달을 띄울 때 문제가 생겨서
// showXMark 실행할 switch 문으로 통합
$('input[class="input-info"]').on('input', function () {
    switch (this.id) {
        // this.id로 가져온 문자열을 '-'로 구분하여 마지막 문자열을 가져옴
        // 이를 이용하여 input의 종류를 구분함

        case 'email-login':
        case 'email-signup':
            let emailStrLogin = this.id.split('-');
            let checkEmail = test_email.test($(this).val());
            showXMark(this.id, checkEmail, emailStrLogin[1]);
            break;

        case 'password-login':
        case 'password-signup':
            $('f-show-' + this.id).addClass('show');
            let passwordStrLogin = this.id.split('-');
            let checkPassword = test_password.test($(this).val());
            showXMark(this.id, checkPassword, passwordStrLogin[1]);

            let checkDup = $(this).val() === $('#confirm-password').val();
            showXMark('confirm-password', checkDup, null);
            // #password == #check-password여도
            // #password의 값이 변하면 #check-password에 xMark 부여
            break;

        case 'confirm-password':
            $('f-show-confirm-' + this.id).addClass('show');
            let password = $('#password-signup').val();
            let confirmPassword = $(this).val();
            let checkConfirmPassword = password === confirmPassword; // 비번 확인 여부
            showXMark(this.id, checkConfirmPassword, null);
            break;

        case 'username-signup':
            let username = $(this).val();
            let checkUsername = test_korean.test(username);
            showXMark(this.id, checkUsername, null);
    }
});

$('.fa-eye').on('click', function (e) {
    console.log(e.target);
    // toggleEye(a, b);
});

// 랜덤 닉네임 생성
$('#create-username-signup').on('click', function (e) {
    $('#username-signup').val(koAliasGen());
    let check = test_korean.test($('#username-signup').val());
    showXMark('username-signup', check, null);
});

// 동적으로 생성된 .fa-xmark를 이벤트 버블링으로 처리함
$('.form-info').on('click', '.fa-xmark', function (e) {
    let aaa = e.target.dataset.ftas;
    $('.input-info').eq(aaa).val('');
});
