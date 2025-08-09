provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "fastapi_server" {
  ami           = "ami-0c02fb55956c7d316" # Amazon Linux 2
  instance_type = "t2.micro"
  key_name      = "your-keypair-name"

  tags = {
    Name = "QuantumEncryptionServer"
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y python3 git
              git clone https://github.com/shyamkaarthikeyan/QuantumBackend.git
              cd QuantumBackend
              pip3 install -r requirements.txt
              nohup uvicorn app:app --host 0.0.0.0 --port 8080 &
              EOF

  vpc_security_group_ids = [aws_security_group.allow_web.id]
}

resource "aws_security_group" "allow_web" {
  name        = "allow_web"
  description = "Allow inbound HTTP/HTTPS and FastAPI"

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}