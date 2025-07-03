datacenter = "dc1"
data_dir = "/consul/data"
log_level = "INFO"
server = true
bootstrap_expect = 1
ui = true

# Enable the Consul UI
connect {
  enabled = true
}

acl {
  enabled = true
  default_policy = "deny"
  down_policy = "extend-cache"
  tokens {
    master = "123456"
  }
}
