FROM python:3.11

WORKDIR /app
COPY ./*.py .
COPY ./requirements.txt .

RUN pip install -r requirements.txt

CMD [ "python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0" ]
