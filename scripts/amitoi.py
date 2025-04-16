import json
from collections import defaultdict
from pathlib import Path

def load_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)

def avg_quantity(entries):
    total_prob = sum(e['prob'] for e in entries)
    if total_prob == 0:
        return 0
    return sum(e['quantity'] * e['prob'] for e in entries) / total_prob

def get_lottery_items(key, unit_data):
    if key not in unit_data:
        return []
    return unit_data[key]['ItemLotteryUnitEntry']

def get_private_group_items(group_id, group_data, unit_data):
    if group_id not in group_data:
        return []

    items = []

    for group_entry in group_data[group_id]['ItemLotteryPrivateGroupEntry']:
        unit_key = group_entry['id']
        group_prob = group_entry.get('prob', 0)
        group_count = group_entry.get('Count', 1)

        unit_entries = get_lottery_items(unit_key, unit_data)
        unit_total_prob = sum(e['prob'] for e in unit_entries)

        for entry in unit_entries:
            normalized_prob = (entry['prob'] / unit_total_prob) * group_prob if unit_total_prob else 0
            items.append({
                'item': entry['item'],
                'quantity': entry['quantity'] * group_count,
                'prob': normalized_prob
            })

    return items

def format_item_summary(items):
    item_map = defaultdict(list)
    for entry in items:
        item_map[entry['item']].append(entry)
    summary = []
    for item, entries in item_map.items():
        total_prob = sum(e['prob'] for e in entries)
        avg_qty = avg_quantity(entries)
        summary.append((item, total_prob / 100000.0, avg_qty))
    return summary

def generate_markdown(region_data, group_data, unit_data, output_path):
    rows = region_data["Rows"]

    with open(output_path, "w", encoding="utf-8") as md:
        for region_key, region in rows.items():
            region_name = region["RegionName"]["LocalizedString"]
            md.write(f"## {region_name}\n\n")

            for reward_set in region["ExpeditionRewards"]:
                md.write(f"### Expedition UID {reward_set['UID']}\n\n")
                md.write("| Expedition Time | Reward 1 | Prob (%) | Qty | Extra Rewards | Special | Special Rate (%) |\n")
                md.write("|-----------------|----------|-----------|------|----------------|---------|-------------------|\n")

                for reward in reward_set["MagicDollCountRewards"]:
                    time = reward_set["ExpedtionTime"]
                    reward1 = reward["DefaultLotteryUnit"]["Key"]
                    private_id = reward["DefaultPrivateLotteryGroupId"]
                    special = reward.get("SpecialLotteryUnit", {}).get("Key", "")
                    special_prob = reward.get("SpecialRewardRate", 0) / 100.0

                    reward1_items = get_lottery_items(reward1, unit_data)
                    reward1_summary = format_item_summary(reward1_items)
                    reward1_item = reward1_summary[0] if reward1_summary else ("", 0, 0)

                    extras = get_private_group_items(private_id, group_data, unit_data)
                    extra_summary = format_item_summary(extras)

                    extra_str = ", ".join(
                        f"{name} ({prob:.2f}% x {qty:.1f})" for name, prob, qty in extra_summary
                    )

                    md.write(f"| {time} | {reward1_item[0]} | {reward1_item[1]:.2f} | {reward1_item[2]:.1f} | {extra_str} | {special} | {special_prob:.2f} |\n")

            md.write("\n\n")

if __name__ == "__main__":
    region_path = "sources/TLMagicDollExpeditionRegion.json"
    group_path = "sources/TLItemLotteryPrivateGroup.json"
    unit_path = "sources/TLItemLotteryUnit.json"
    output_md = "docs/doll/expeditionRewards.md"

    region_data = load_json(region_path)[0]  # <- add [0]
    group_data = load_json(group_path)[0]["Rows"]
    unit_data = load_json(unit_path)[0]["Rows"]


    generate_markdown(region_data, group_data, unit_data, output_md)
    print(f"✅ Markdown written to {output_md}")
