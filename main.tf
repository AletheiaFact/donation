resource "aws_ssm_parameter" "Aletheia" {
    name  = "foo"
    type  = "String"
    value = "barr"
}