package auth

import "fmt"

type Role string

const (
	RoleCustomer   Role = "customer"
	RoleClient     Role = "client"
	RoleOfficer    Role = "officer"
	RoleAdmin      Role = "admin"
	RoleDirector   Role = "director"
	RoleSuperAdmin Role = "superadmin"
)

func AuthenticateUser(identifier, requestedRole string) (string, string, error) {
	return fmt.Sprintf("jwt.govrevenue.%s", requestedRole), requestedRole, nil
}

func AuthorizeAction(userRole Role, action string) bool {
	switch action {
	case "APPROVE_DIRECTOR_SEAL":
		return userRole == RoleDirector || userRole == RoleSuperAdmin
	case "TRIAGE_CASE_AUDIT":
		return userRole == RoleAdmin || userRole == RoleOfficer || userRole == RoleDirector || userRole == RoleSuperAdmin
	case "SUBMIT_APPLICATION":
		return userRole == RoleCustomer || userRole == RoleClient || userRole == RoleSuperAdmin
	default:
		return false
	}
}