pragma solidity ^0.5.0;

contract CryptoPass {
    struct Account {
        address owner;
        string id;
        string handle;
        string name;
        string password;
        uint256 created;
    }

    mapping (address => Account[]) public Accounts;

    event AccountCreated(address _owner, string _id, string _name, string _handle, string _password, uint256 _created);

    function createAccount(string memory _id, string memory _name, string memory _handle, string memory _password, uint256 _created) public {
        Account memory _account;
        _account.id = _id;
        _account.owner = msg.sender;
        _account.name = _name;
        _account.handle = _handle;
        _account.password = _password;
        _account.created = _created;

        Accounts[msg.sender].push(_account);
        emit AccountCreated(msg.sender, _account.id, _account.name, _account.handle, _account.password, _account.created);
    }
    
    function getAccountLength() public view returns(uint count) {
        return Accounts[msg.sender].length;
    }
}