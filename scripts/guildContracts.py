from _utils import sidebarjson, loadFile, writeMarkdown

TLDynamicEventCommon = loadFile('sources/TLDynamicEventCommon')
TLGuildContractInfo = loadFile('sources/TLGuildContractInfo')

outputDir = 'docs/guild/'

def guildContract():
    contracts = {}
    
    i = 0
    for key, value in TLGuildContractInfo.items():
        contracts[i] = {
            'Type': value.get("ContractType"),
            'Title': value.get("Title",{}).get("LocalizedString"),
            'Subtitle': value.get("SubTitle",{}).get("LocalizedString"),
            #'Objective': value.get("ObjectiveDescriptionList",{})[0].get("ObjectiveDescriptionText",{}).get("LocalizedString")
        }
        i += 1

    outputName = 'guildContract.md'
    output = outputDir + outputName

    contracts_List = list(contracts.values())
    sorted_contracts = sorted(contracts_List, key=lambda x: (x['Type'], x['Title'], x['Subtitle']))
    sorted_contracts_dict = {}
    for i, contract_data in enumerate(sorted_contracts):
        sorted_contracts_dict[i] = contract_data

    writeMarkdown( output, "Guild Contracts",
    {
        'cat1': "Basics",
        'sub1': "Guild"
    }, sorted_contracts_dict)

guildContract()