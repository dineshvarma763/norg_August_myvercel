#!/bin/bash

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NO_COLOR='\033[0m' # No Color

redirects_filename="Redirects-List.txt"
redirects_fixed_filename="Redirects-List-Fixed.txt"

if [[ ! -f "$redirects_filename" ]]; then
    echo -e "ERROR: ${RED}>>>>>>>${NO_COLOR}The file $redirects_filename does not exist.${RED}<<<<<<<<${NO_COLOR}"
    exit 1
fi

awk -F'[ >]+' '{print $4 "," $6}' "$redirects_filename" > "$redirects_fixed_filename"

# Define the hostname
#hostname="http://localhost:3000"
hostname="https://ata-git-develop-conversion-digital.vercel.app"

# Set the Internal Field Separator to ','
IFS=','

# Function to remove trailing slash
rtrim() {
    local var="$*"
    echo -n "$var" | sed 's:/*$::'
}


# Read URL pairs from the file.
while read -r source destination; do
  # Skip blank lines
  [ -z "$source" ] && continue
  [ -z "$destination" ] && continue

  # Append hostname to source and destination
  source="${hostname}${source}"
  destination="${hostname}${destination}"

  # Print the source URL and the expected destination URL
  #echo "Source URL: $source is expected to redirect to Destination URL: $destination"

  # Check for redirection using curl.
  actual_destination=$(curl -Ls -o /dev/null -w %{url_effective} "$source")

  # Compare the actual destination after redirection with the target URL ignoring trailing slash.
  actual_destination=$(rtrim "$destination")
  destination=$(rtrim "$destination")
  if [ "$actual_destination" = "$destination" ]; then
		echo -e "${GREEN}Success: $source is correctly redirected to $destination${NO_COLOR}"
  else
    echo -e "${RED}Failed: $source is redirected to $actual_destination instead of $destination${NO_COLOR}"
  fi
done < "$redirects_fixed_filename"
