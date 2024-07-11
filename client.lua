local isTalking = false

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(200) 

        local playerPed = PlayerPedId()
        local playerId = GetPlayerServerId(PlayerId()) 
        local playerHealth = GetEntityHealth(playerPed) - 100
        local playerArmor = GetPedArmour(playerPed)
        local vehicle = GetVehiclePedIsIn(playerPed, false)
        local inVehicle = vehicle ~= 0
        local speed = 0

        if inVehicle then
            speed = GetEntitySpeed(vehicle) * 3.6 
        end

        -- Determine voice status
        local newTalking = NetworkIsPlayerTalking(PlayerId())
        if newTalking ~= isTalking then
            isTalking = newTalking

         
            SendNUIMessage({
                type = 'initialLoad',
                id = playerId,
                health = playerHealth,
                armor = playerArmor,
                talking = isTalking
            })
        end

   
        SendNUIMessage({
            type = 'updateStatus',
            id = playerId,
            health = playerHealth,
            armor = playerArmor,
            inVehicle = inVehicle,
            speed = math.floor(speed),
            talking = isTalking
        })
    end
end)
