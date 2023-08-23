resource "aws_ssm_parameter" "aletheia" {
    name = "foo",
    type = "string",
    value = "bar",
}