# Learn Dotenv Vault

이 레포지토리는 dotenv-org/dotenv-vault 의 기능성과 적용 가능성 실험을 위해 만들어졌습니다. dotenv-vault는 팀 내 시크릿은 `DOTENV_KEY` 하나만을 두고, 나머지 정보는 모두 `.env.vault` 파일에 암호화해 저장하고 커밋하는 방식으로 운영합니다.

## 파일
- `config-dotenv-vault.js`: `node`를 실행할 `-r` 플래그로 `require`해서 `.env.vault`를 해석해 `process.env`에 설정하는 역할을 합니다.
- `main.js`: 설정된 환경 변수를 갖고 실행될 파일입니다. 실제 상황이라면 서버 등의 엔트리일 것입니다.

## 실험 방법

실험의 목표는 `.env`로부터 `.env.vault`를 만들어내고, `.env.vault`와 `DOTENV_KEY`에만 의존해 환경변수들을 잘 설정할 수 있는지 보는 것입니다.

우선 의존성을 설치합니다.

```bash
yarn
```

`.env`와 `.env.production`을 만듭니다. 이 파일들은 커밋하지 않습니다.

```bash
echo -e "DOTENV_TEST_A=dev_a\nDOTENV_TEST_B=dev_b" > .env  # development 환경변수들의 모음입니다.
echo -e "DOTENV_TEST_A=prd_a\nDOTENV_TEST_B=prd_b" > .env.production
```

이제 `.env`와 `.env.production`으로부터 `.env.vault`를 만들어봅시다.

```bash
yarn dotenv-vault local build
```

이제 `.env.keys`와 `.env.vault`가 업데이트 되었을 것입니다.

`config-dotenv-vault.js`는 `DOTENV_KEY` 혹은 `DOTENV_ENV`를 보고 `.env.vault`의 해당하는 정보를 복호화해 `process.env`에 설정하는 일을 합니다.
`DOTENV_ENV`에 따라 `main.js`가 각 환경에 맞게 잘 실행되는지 확인해봅시다.

```bash
# `development` 환경에서 실행
node -r ./config-dotenv-vault main.js
# `production` 환경에서 실행
DOTENV_ENV=production node -r ./config-dotenv-vault main.js
```

각 환경마다 다른 환경변수가 잘 적용되어 출력된다면 성공입니다!
