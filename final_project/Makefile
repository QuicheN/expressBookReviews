BASE_URL := http://localhost:5001
COOKIE_JAR := .cookies.txt
USER_JSON := {"username": "kss", "password": "12345"}

# Default ID used if none is passed on the command line, e.g. `make review ID=5`
ID ?= 2

.PHONY: register login review delete-review clean

register:
	@echo "== register =="
	@curl -s --json '$(USER_JSON)' $(BASE_URL)/register; echo

login:
	@echo "== login =="
	@curl -s -c $(COOKIE_JAR) --json '$(USER_JSON)' $(BASE_URL)/customer/login; echo

review:
	@echo "== add review (id=$(ID)) =="
	@curl -s -b $(COOKIE_JAR) -X PUT --json '{"review": "test", "username": "kss"}' \
		$(BASE_URL)/customer/auth/review/$(ID); echo

delete-review:
	@echo "== delete review (id=$(ID)) =="
	@curl -s -b $(COOKIE_JAR) -X DELETE $(BASE_URL)/customer/auth/review/$(ID); echo
	@echo "== book after delete =="
	@curl -s $(BASE_URL)/isbn/$(ID); echo

clean:
	@rm -f $(COOKIE_JAR)