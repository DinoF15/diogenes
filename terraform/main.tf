provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "diogenes" {
  name     = "diogenes-rg"
  location = "East US"
}

resource "azurerm_postgresql_server" "diogenes" {
  name                = "diogenes-db"
  location            = azurerm_resource_group.diogenes.location
  resource_group_name = azurerm_resource_group.diogenes.name
  administrator_login = "postgresadmin"
  administrator_password = "password1234"  # Change to a secure password
  version             = "11"
  sku_name            = "B_Gen5_1"
  storage_mb          = 5120
  backup_retention_days = 7
  geo_redundant_backup = "Disabled"
}

resource "azurerm_postgresql_database" "diogenes_db" {
  name                = "diogenes_db"
  resource_group_name = azurerm_resource_group.diogenes.name
  server_name         = azurerm_postgresql_server.diogenes.name
}

resource "azurerm_app_service_plan" "diogenes" {
  name                = "diogenes-service-plan"
  location            = azurerm_resource_group.diogenes.location
  resource_group_name = azurerm_resource_group.diogenes.name
  kind                = "Linux"
  reserved            = true
  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_app_service" "diogenes" {
  name                = "diogenes-app"
  location            = azurerm_resource_group.diogenes.location
  resource_group_name = azurerm_resource_group.diogenes.name
  app_service_plan_id = azurerm_app_service_plan.diogenes.id
  app_settings = {
    "DATABASE_URL" = "postgresql://${azurerm_postgresql_server.diogenes.administrator_login}:${azurerm_postgresql_server.diogenes.administrator_password}@${azurerm_postgresql_server.diogenes.fqdn}/${azurerm_postgresql_database.diogenes_db.name}"
    "AZURE_OPENAI_API_KEY" = "your-api-key"
    "AZURE_OPENAI_ENDPOINT" = "https://your-openai-endpoint"
  }

  site_config {
    linux_fx_version = "NODE|16"  # Adjust according to the Node.js version you're using
  }
}
