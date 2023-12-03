FROM python:3.11

WORKDIR /app
COPY . .
COPY ./requirements.txt .

RUN pip install -r requirements.txt

CMD [ "python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0" ]
